type Schema = Record<string, unknown> | null | undefined;

/** Renders one or more JSON-LD <script> blocks (skips empty/null entries). */
export function JsonLd({ data }: { data: Schema | Schema[] }) {
  const list = (Array.isArray(data) ? data : [data]).filter(
    (d): d is Record<string, unknown> => !!d && Object.keys(d).length > 0,
  );
  if (!list.length) return null;
  return (
    <>
      {list.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
