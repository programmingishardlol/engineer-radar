type SourceListProps = {
  sources: string[];
  generatedAt?: string;
};

export function SourceList({ sources, generatedAt }: SourceListProps) {
  return (
    <aside className="rounded-md border border-[#cbd6d0] bg-white p-4">
      <h2 className="text-sm font-semibold text-[#26352f]">Mock sources</h2>
      <ul className="mt-3 space-y-1 text-sm text-[#53655c]">
        {sources.length > 0 ? sources.map((source) => <li key={source}>{source}</li>) : <li>No sources loaded.</li>}
      </ul>
      {generatedAt ? (
        <p className="mt-4 text-xs text-[#72827a]">Generated {new Date(generatedAt).toLocaleTimeString()}</p>
      ) : null}
    </aside>
  );
}
