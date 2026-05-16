import type { Collector } from "./types";
import type { Category, RawItem, SourceType } from "../types";

type RssParserOptions = {
  feedUrl: string;
  sourceName: string;
  sourceType?: SourceType;
  category?: Category;
  credibility?: number;
  priority?: number;
  includeKeywords?: string[];
  excludeKeywords?: string[];
  maxItems?: number;
  now?: () => Date;
};

type ParsedEntry = {
  entryXml: string;
  index: number;
  format: "rss" | "atom";
};

const entryPattern = /<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi;

const globalLowSignalRules = [
  { id: "webinar", keywords: ["webinar", "online seminar"] },
  { id: "customer-story", keywords: ["customer story", "customer stories", "case study"] },
  { id: "generic-event", keywords: ["generic event", "conference", "summit", "meet us at", "join us at"] },
  { id: "hiring-pr", keywords: ["we are hiring", "we're hiring", "now hiring", "career opportunity"] },
  { id: "marketing-only", keywords: ["brand campaign", "award-winning", "market leader", "thought leadership"] },
  { id: "sales-partner", keywords: ["partner program", "channel partner", "sales team", "sales teams", "sponsored"] }
];

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, codePoint: string) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint: string) => String.fromCodePoint(Number.parseInt(codePoint, 16)));
}

function cleanXmlText(value: string): string {
  return decodeXmlEntities(value)
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(xml: string, tagName: string): string | undefined {
  const escapedTag = tagName.replace(":", "\\:");
  const match = xml.match(new RegExp(`<${escapedTag}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, "i"));
  const value = match?.[1] ? cleanXmlText(match[1]) : undefined;
  return value || undefined;
}

function readAttribute(xml: string, tagName: string, attributeName: string): string | undefined {
  const escapedTag = tagName.replace(":", "\\:");
  const match = xml.match(new RegExp(`<${escapedTag}\\b[^>]*\\s${attributeName}=["']([^"']+)["'][^>]*>`, "i"));
  return match?.[1] ? decodeXmlEntities(match[1]).trim() : undefined;
}

function readAtomUrl(entryXml: string): string | undefined {
  const linkTags = entryXml.match(/<link\b[^>]*>/gi) ?? [];
  const preferredLink =
    linkTags.find((tag) => /rel=["']alternate["']/i.test(tag)) ??
    linkTags.find((tag) => !/rel=["']self["']/i.test(tag));

  return preferredLink ? readAttribute(preferredLink, "link", "href") : undefined;
}

function readEntryUrl(entryXml: string, format: ParsedEntry["format"]): string | undefined {
  if (format === "atom") {
    return readAtomUrl(entryXml);
  }

  return readTag(entryXml, "link") ?? readTag(entryXml, "guid");
}

function readEntryDate(entryXml: string, now: () => Date): string {
  const dateText =
    readTag(entryXml, "pubDate") ??
    readTag(entryXml, "published") ??
    readTag(entryXml, "updated") ??
    readTag(entryXml, "dc:date");

  if (!dateText) {
    return now().toISOString();
  }

  const parsedDate = new Date(dateText);
  return Number.isNaN(parsedDate.getTime()) ? now().toISOString() : parsedDate.toISOString();
}

function readEntryRawText(entryXml: string): string | undefined {
  return (
    readTag(entryXml, "description") ??
    readTag(entryXml, "summary") ??
    readTag(entryXml, "content:encoded") ??
    readTag(entryXml, "content")
  );
}

function stableHash(value: string): string {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function parseEntries(xml: string): ParsedEntry[] {
  return [...xml.matchAll(entryPattern)].map((match, index) => ({
    entryXml: match[0],
    index,
    format: match[0].startsWith("<entry") ? "atom" : "rss"
  }));
}

function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().replace(/\s+/g, " ").trim();
}

function searchableEntryText(title: string, rawText?: string): string {
  return `${title} ${rawText ?? ""}`.toLowerCase().replace(/\s+/g, " ").trim();
}

function findKeywordMatch(text: string, keywords: string[] = []): string | undefined {
  return keywords.map(normalizeKeyword).find((keyword) => keyword.length > 0 && text.includes(keyword));
}

function lowSignalReason(text: string): string | undefined {
  for (const rule of globalLowSignalRules) {
    const keyword = findKeywordMatch(text, rule.keywords);
    if (keyword) {
      return `${rule.id}:${keyword}`;
    }
  }

  return undefined;
}

function qualityDecision(
  title: string,
  rawText: string | undefined,
  options: Pick<RssParserOptions, "includeKeywords" | "excludeKeywords">
): { included: true; reason: string } | { included: false; reason: string } {
  const text = searchableEntryText(title, rawText);
  const excludedBySource = findKeywordMatch(text, options.excludeKeywords);
  if (excludedBySource) {
    return { included: false, reason: `source-exclude:${excludedBySource}` };
  }

  const excludedByGlobalRule = lowSignalReason(text);
  if (excludedByGlobalRule) {
    return { included: false, reason: excludedByGlobalRule };
  }

  if (options.includeKeywords && options.includeKeywords.length > 0) {
    const includedBySource = findKeywordMatch(text, options.includeKeywords);
    if (!includedBySource) {
      return { included: false, reason: "missing-include-keyword" };
    }

    return { included: true, reason: `source-include:${includedBySource}` };
  }

  return { included: true, reason: "no-source-include-keywords" };
}

export function parseRssXmlToRawItems(xml: string, options: RssParserOptions): RawItem[] {
  const now = options.now ?? (() => new Date());
  const maxItems = options.maxItems ?? 20;

  return parseEntries(xml).slice(0, maxItems).flatMap(({ entryXml, index, format }): RawItem[] => {
    const title = readTag(entryXml, "title");
    const url = readEntryUrl(entryXml, format);

    if (!title || !url) {
      return [];
    }

    const publishedAt = readEntryDate(entryXml, now);
    const rawText = readEntryRawText(entryXml);
    const quality = qualityDecision(title, rawText, options);
    if (!quality.included) {
      return [];
    }

    const id = `rss-${stableHash(`${options.feedUrl}:${url}:${publishedAt}:${index}`)}`;

    return [
      {
        id,
        title,
        url,
        source: options.sourceName,
        sourceType: options.sourceType ?? "rss",
        publishedAt,
        ...(rawText ? { rawText } : {}),
        metadata: {
          feedUrl: options.feedUrl,
          feedFormat: format,
          qualityFilter: "included",
          qualityFilterReason: quality.reason,
          sourcePriority: options.priority ?? 50,
          ...(options.category ? { category: options.category } : {}),
          ...(options.credibility ? { sourceCredibility: options.credibility } : {})
        }
      }
    ];
  });
}

export const collectRssItems: Collector = async (context) => {
  if (!context?.source?.url || !context.fetch) {
    return [];
  }

  try {
    const response = await context.fetch(context.source.url);

    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    return parseRssXmlToRawItems(xml, {
      feedUrl: context.source.url,
      sourceName: context.source.name,
      sourceType: context.source.sourceType,
      category: context.source.category,
      credibility: context.source.credibility,
      priority: context.source.priority,
      includeKeywords: context.source.includeKeywords,
      excludeKeywords: context.source.excludeKeywords,
      maxItems: 20,
      now: context.now
    });
  } catch {
    return [];
  }
};
