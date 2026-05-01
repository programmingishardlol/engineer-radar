import type { Collector } from "./types";
import type { Category, RawItem, SourceType } from "../types";

type RssParserOptions = {
  feedUrl: string;
  sourceName: string;
  sourceType?: SourceType;
  category?: Category;
  credibility?: number;
  maxItems?: number;
  now?: () => Date;
};

type ParsedEntry = {
  entryXml: string;
  index: number;
  format: "rss" | "atom";
};

const entryPattern = /<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi;

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
      maxItems: 20,
      now: context.now
    });
  } catch {
    return [];
  }
};
