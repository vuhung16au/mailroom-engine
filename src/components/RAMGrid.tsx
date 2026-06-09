interface RAMGridProps {
  memory: number[];
  mar: number;
  programCounter: number;
}

export function RAMGrid({ memory, mar, programCounter }: RAMGridProps) {
  return (
    <section className="panel">
      <h2>Random Access Memory</h2>
      <div className="ramGrid">
        {memory.map((value, index) => {
          const highlighted = index === mar || index === programCounter;
          return (
            <div key={index} className={`ramCell${highlighted ? " highlighted" : ""}`}>
              <div className="addr">{index.toString().padStart(2, "0")}</div>
              <div className="val">{value.toString().padStart(3, "0")}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
