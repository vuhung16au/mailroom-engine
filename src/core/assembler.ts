const OPCODES: Record<string, number> = {
  ADD: 100,
  SUB: 200,
  STA: 300,
  LDA: 500,
  BRA: 600,
  BRZ: 700,
  BRP: 800,
};

interface ParsedLine {
  label?: string;
  instruction: string;
  operand?: string;
}

const parseLine = (line: string): ParsedLine | null => {
  const stripped = line.split("//")[0].trim();
  if (!stripped) return null;
  const parts = stripped.split(/\s+/);
  if (parts.length === 1) return { instruction: parts[0].toUpperCase() };

  const first = parts[0].toUpperCase();
  if (first in OPCODES || ["INP", "OUT", "HLT", "DAT"].includes(first) || /^\d+$/.test(first)) {
    return {
      instruction: first,
      operand: parts[1],
    };
  }

  return {
    label: first,
    instruction: parts[1].toUpperCase(),
    operand: parts[2],
  };
};

export const assemble = (source: string): number[] => {
  const memory = new Array<number>(100).fill(0);
  const parsed = source
    .split("\n")
    .map(parseLine)
    .filter((line): line is ParsedLine => line !== null);

  const labels = new Map<string, number>();
  parsed.forEach((line, idx) => {
    if (line.label) labels.set(line.label, idx);
  });

  parsed.forEach((line, idx) => {
    const { instruction, operand } = line;

    if (/^\d{1,3}$/.test(instruction)) {
      memory[idx] = Number(instruction);
      return;
    }

    if (instruction === "DAT") {
      memory[idx] = operand ? Number(operand) : 0;
      return;
    }

    if (instruction === "INP") {
      memory[idx] = 901;
      return;
    }

    if (instruction === "OUT") {
      memory[idx] = 902;
      return;
    }

    if (instruction === "HLT") {
      memory[idx] = 0;
      return;
    }

    const base = OPCODES[instruction];
    if (base === undefined) {
      throw new Error(`Unknown instruction: ${instruction}`);
    }

    const rawOperand = operand ?? "0";
    const operandAddress = /^\d+$/.test(rawOperand)
      ? Number(rawOperand)
      : labels.get(rawOperand.toUpperCase()) ?? 0;

    memory[idx] = base + operandAddress;
  });

  return memory;
};
