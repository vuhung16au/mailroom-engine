import { CPUState } from "@/core/types";

interface CPUPanelProps {
  state: CPUState;
  output: number[];
  pendingInput: string;
  onPendingInputChange: (value: string) => void;
  onSubmitInput: () => void;
  onClockSpeedChange: (value: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
}

export function CPUPanel({
  state,
  output,
  pendingInput,
  onPendingInputChange,
  onSubmitInput,
  onClockSpeedChange,
  onPlay,
  onPause,
  onStep,
}: CPUPanelProps) {
  return (
    <section className="panel">
      <h2>Central Processing Unit</h2>
      <div className="cpuGrid">
        <div><strong>Program Counter:</strong> {state.programCounter}</div>
        <div><strong>MAR:</strong> {state.MAR}</div>
        <div><strong>MDR:</strong> {state.MDR}</div>
        <div><strong>CIR:</strong> {state.CIR}</div>
        <div><strong>Accumulator:</strong> {state.accumulator}</div>
      </div>
      <label htmlFor="clockSpeed">Clock Speed: {state.clockSpeed} ms</label>
      <input
        id="clockSpeed"
        type="range"
        min={50}
        max={2000}
        step={50}
        value={state.clockSpeed}
        onChange={(event) => onClockSpeedChange(Number(event.target.value))}
      />
      <div className="buttonRow">
        <button onClick={onPlay}>Play</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onStep}>Step</button>
      </div>
      <div className="ioGrid">
        <div>
          <h3>Input</h3>
          <input
            aria-label="Input terminal"
            value={pendingInput}
            onChange={(event) => onPendingInputChange(event.target.value)}
            type="number"
          />
          <button onClick={onSubmitInput}>Submit Input</button>
        </div>
        <div>
          <h3>Output</h3>
          <textarea readOnly value={output.join("\n")} rows={5} aria-label="Output terminal" />
        </div>
      </div>
    </section>
  );
}
