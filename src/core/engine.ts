import { CPUState } from "./types";

const instructionName = (opcode: number): string => {
  if (opcode === 0) return "HLT";
  if (opcode === 901) return "INP";
  if (opcode === 902) return "OUT";

  const family = Math.floor(opcode / 100);
  return (
    {
      1: "ADD",
      2: "SUB",
      3: "STA",
      5: "LDA",
      6: "BRA",
      7: "BRZ",
      8: "BRP",
    }[family] ?? "DAT"
  );
};

const pad3 = (value: number): number => Number(value.toString().padStart(3, "0"));

export class LMCSystem {
  memory: number[];
  state: CPUState;
  output: number[];
  inputQueue: number[];

  constructor(clockSpeed = 500) {
    this.memory = new Array<number>(100).fill(0);
    this.state = {
      programCounter: 0,
      MAR: 0,
      MDR: 0,
      CIR: 0,
      accumulator: 0,
      clockSpeed,
      halted: false,
      fdeCycleCount: 0,
    };
    this.output = [];
    this.inputQueue = [];
  }

  reset(memory: number[]) {
    this.memory = [...memory.slice(0, 100), ...new Array(Math.max(0, 100 - memory.length)).fill(0)].slice(0, 100);
    this.state = {
      ...this.state,
      programCounter: 0,
      MAR: 0,
      MDR: 0,
      CIR: 0,
      accumulator: 0,
      halted: false,
      fdeCycleCount: 0,
    };
    this.output = [];
  }

  enqueueInput(value: number) {
    this.inputQueue.push(value);
  }

  setClockSpeed(clockSpeed: number) {
    this.state = {
      ...this.state,
      clockSpeed,
    };
  }

  step(): string {
    if (this.state.halted) return "";

    const lines: string[] = [
      "----------------------------------------------",
      "Fetching instruction...",
      `   Set MAR to value held by Program Counter: ${this.state.programCounter}`,
    ];

    this.state.MAR = this.state.programCounter;
    this.state.programCounter = (this.state.programCounter + 1) % 100;

    lines.push("   Increment Program Counter by 1");
    lines.push("   Fetch instruction from address stored in the MAR");

    this.state.MDR = this.memory[this.state.MAR] ?? 0;
    lines.push(`   Fetched instruction: ${this.state.MDR} stored in the MDR`);
    this.state.CIR = this.state.MDR;
    lines.push("   Copy instruction from the MDR to the CIR");

    const opcode = this.state.CIR;
    const mnemonic = instructionName(opcode);
    const operand = opcode % 100;

    lines.push("Decoding instruction stored in CIR...");
    lines.push(`   ${mnemonic}`);
    lines.push("Executing Instruction...");

    switch (mnemonic) {
      case "ADD": {
        this.state.MAR = operand;
        const prior = this.state.accumulator;
        this.state.MDR = this.memory[this.state.MAR] ?? 0;
        this.state.accumulator = (prior + this.state.MDR + 1000) % 1000;
        lines.push(`   Set MAR to the operand of the current instruction: ${operand}`);
        lines.push(`   Fetch data at the location held by the MAR and store it in the MDR: ${this.state.MDR}`);
        lines.push(
          `   Add MDR value to the Accumulator and store the result in the Accumulator: ${prior}+${this.state.MDR}=${this.state.accumulator}`,
        );
        break;
      }
      case "SUB": {
        this.state.MAR = operand;
        const prior = this.state.accumulator;
        this.state.MDR = this.memory[this.state.MAR] ?? 0;
        this.state.accumulator = (prior - this.state.MDR + 1000) % 1000;
        lines.push(`   Set MAR to the operand of the current instruction: ${operand}`);
        lines.push(`   Fetch data at the location held by the MAR and store it in the MDR: ${this.state.MDR}`);
        lines.push(
          `   Subtract MDR value from the Accumulator and store the result in the Accumulator: ${prior}-${this.state.MDR}=${this.state.accumulator}`,
        );
        break;
      }
      case "STA": {
        this.state.MAR = operand;
        this.state.MDR = this.state.accumulator;
        this.memory[this.state.MAR] = pad3(this.state.MDR);
        lines.push(`   Set MAR to the operand of the current instruction: ${operand}`);
        lines.push(`   Set MDR to the value held in the Accumulator: ${this.state.MDR}`);
        lines.push(`   Store MDR value ${this.state.MDR} at the memory location held in the MAR: ${operand}`);
        break;
      }
      case "LDA": {
        this.state.MAR = operand;
        this.state.MDR = this.memory[this.state.MAR] ?? 0;
        this.state.accumulator = this.state.MDR;
        lines.push(`   Set MAR to the operand of the current instruction: ${operand}`);
        lines.push(`   Fetch data at the location held by the MAR and store it in the MDR: ${this.state.MDR}`);
        lines.push(`   Copy MDR value to the Accumulator: ${this.state.accumulator}`);
        break;
      }
      case "BRA": {
        this.state.programCounter = operand;
        lines.push(`   Set Program Counter to the operand of the current instruction: ${operand}`);
        break;
      }
      case "BRZ": {
        if (this.state.accumulator === 0) {
          this.state.programCounter = operand;
          lines.push(`   Accumulator is zero, set Program Counter to operand: ${operand}`);
        } else {
          lines.push("   Accumulator is not zero, continue to next instruction");
        }
        break;
      }
      case "BRP": {
        if (this.state.accumulator < 500) {
          this.state.programCounter = operand;
          lines.push(`   Accumulator is positive, set Program Counter to operand: ${operand}`);
        } else {
          lines.push("   Accumulator is negative, continue to next instruction");
        }
        break;
      }
      case "INP": {
        const input = this.inputQueue.shift();
        lines.push("   Waiting for user input");
        this.state.accumulator = input ?? 0;
        lines.push(`   Store user input in Accumulator: ${this.state.accumulator}`);
        break;
      }
      case "OUT": {
        this.output.push(this.state.accumulator);
        lines.push(`   Output value held in the Accumulator: ${this.state.accumulator}`);
        break;
      }
      case "HLT": {
        this.state.halted = true;
        lines.push("   Program stopped");
        break;
      }
      default:
        lines.push("   DAT encountered - no operation");
    }

    this.state.fdeCycleCount += 1;
    lines.push("----------------------------------------------");
    if (this.state.halted) {
      lines.push(`Program Executed in ${this.state.fdeCycleCount} FDE Cycles.`);
    }

    return lines.join("\n");
  }
}
