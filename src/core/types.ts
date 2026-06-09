export interface CPUState {
  programCounter: number;
  MAR: number;
  MDR: number;
  CIR: number;
  accumulator: number;
  clockSpeed: number;
  halted: boolean;
  fdeCycleCount: number;
}
