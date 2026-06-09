interface FDELogProps {
  currentCycle: number;
  loggingEnabled: boolean;
  onToggleLogging: (value: boolean) => void;
  logs: string[];
}

export function FDELog({ currentCycle, loggingEnabled, onToggleLogging, logs }: FDELogProps) {
  return (
    <section className="panel">
      <h2>FDE Cycle & Log File</h2>
      <p><strong>Current FDE Cycle:</strong> {currentCycle}</p>
      <label htmlFor="logToggle">
        Log File: {loggingEnabled ? "On" : "Off"}
      </label>
      <input
        id="logToggle"
        type="checkbox"
        checked={loggingEnabled}
        onChange={(event) => onToggleLogging(event.target.checked)}
      />
      <textarea readOnly value={logs.join("\n")} rows={18} aria-label="FDE log output" />
    </section>
  );
}
