interface ProgramEditorProps {
  code: string;
  selectedProgram: string;
  onCodeChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onLoadProgram: () => void;
  onLoadProgramInRam: () => void;
  onRunProgram: () => void;
}

const PROGRAM_OPTIONS = [
  "Adding 2 inputs",
  "Max of 2 inputs",
  "Count down timer",
  "Multiplying 2 inputs",
  "Triangular Numbers",
  "Factorial of...",
  "Immediate Addressing",
  "Indirect Addressing",
];

export function ProgramEditor({
  code,
  selectedProgram,
  onCodeChange,
  onProgramChange,
  onLoadProgram,
  onLoadProgramInRam,
  onRunProgram,
}: ProgramEditorProps) {
  return (
    <section className="panel">
      <h2>Program Editor</h2>
      <label htmlFor="files">Programs</label>
      <select id="files" value={selectedProgram} onChange={(event) => onProgramChange(event.target.value)}>
        {PROGRAM_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <textarea
        aria-label="Assembly Code"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        rows={12}
      />
      <div className="buttonRow">
        <button onClick={onLoadProgram}>Load Program</button>
        <button onClick={onLoadProgramInRam}>Load Program in RAM</button>
        <button onClick={onRunProgram}>Run Program</button>
      </div>
    </section>
  );
}
