"use client";

import { useEffect, useMemo, useState } from "react";
import { CPUPanel } from "@/components/CPUPanel";
import { FDELog } from "@/components/FDELog";
import { ProgramEditor } from "@/components/ProgramEditor";
import { RAMGrid } from "@/components/RAMGrid";
import { assemble } from "@/core/assembler";
import { LMCSystem } from "@/core/engine";

const SAMPLE_PROGRAMS: Record<string, string> = {
  "Adding 2 inputs": `INP
STA 06
INP
ADD 06
OUT
HLT
DAT`,
  "Max of 2 inputs": `INP
STA A
INP
SUB A
BRP BIGGER
LDA A
OUT
HLT
BIGGER LDA 01
OUT
HLT
A DAT`,
  "Count down timer": `INP
LOOP OUT
SUB ONE
BRP LOOP
HLT
ONE DAT 1`,
  "Multiplying 2 inputs": `INP
STA N
INP
STA M
LDA ZERO
LOOP ADD N
SUB ONE
BRP LOOP
OUT
HLT
N DAT
M DAT
ONE DAT 1
ZERO DAT 0`,
  "Triangular Numbers": `INP
STA N
LDA ZERO
STA SUM
LOOP LDA SUM
ADD N
STA SUM
LDA N
SUB ONE
STA N
BRP LOOP
LDA SUM
OUT
HLT
N DAT
SUM DAT
ONE DAT 1
ZERO DAT 0`,
  "Factorial of...": `INP
OUT
HLT`,
  "Immediate Addressing": `LDA 08
OUT
HLT
DAT
DAT
DAT
DAT
DAT
123`,
  "Indirect Addressing": `LDA 10
OUT
HLT
DAT
DAT
DAT
DAT
DAT
DAT
DAT
321`,
};

export default function Home() {
  const defaultProgram = "Count down timer";
  const [selectedProgram, setSelectedProgram] = useState(defaultProgram);
  const [code, setCode] = useState(SAMPLE_PROGRAMS[defaultProgram]);
  const [memory, setMemory] = useState<number[]>(new Array(100).fill(0));
  const [logs, setLogs] = useState<string[]>([]);
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [running, setRunning] = useState(false);
  const [pendingInput, setPendingInput] = useState("");

  const system = useMemo(() => new LMCSystem(500), []);
  const [state, setState] = useState(system.state);
  const [output, setOutput] = useState<number[]>([]);

  useEffect(() => {
    if (!running || state.halted) return;
    const timer = setInterval(() => {
      const log = system.step();
      setState({ ...system.state });
      setMemory([...system.memory]);
      setOutput([...system.output]);
      if (loggingEnabled && log) {
        setLogs((prev) => [...prev, log]);
      }
      if (system.state.halted) {
        setRunning(false);
      }
    }, state.clockSpeed);
    return () => clearInterval(timer);
  }, [running, state.clockSpeed, state.halted, system, loggingEnabled]);

  const loadProgram = () => {
    setCode(SAMPLE_PROGRAMS[selectedProgram]);
  };

  const loadProgramInRam = () => {
    const assembled = assemble(code);
    system.reset(assembled);
    setState({ ...system.state });
    setMemory([...system.memory]);
    setOutput([]);
    setLogs([]);
  };

  const runProgram = () => setRunning(true);

  const stepProgram = () => {
    const log = system.step();
    setState({ ...system.state });
    setMemory([...system.memory]);
    setOutput([...system.output]);
    if (loggingEnabled && log) {
      setLogs((prev) => [...prev, log]);
    }
  };

  const submitInput = () => {
    if (!pendingInput.trim()) return;
    system.enqueueInput(Number(pendingInput));
    setPendingInput("");
  };

  return (
    <div className="app">
      <header>
        <h1>mailroom-engine: Simulated LMC</h1>
      </header>
      <main className="dashboard">
        <ProgramEditor
          code={code}
          selectedProgram={selectedProgram}
          onCodeChange={setCode}
          onProgramChange={setSelectedProgram}
          onLoadProgram={loadProgram}
          onLoadProgramInRam={loadProgramInRam}
          onRunProgram={runProgram}
        />
        <CPUPanel
          state={state}
          output={output}
          pendingInput={pendingInput}
          onPendingInputChange={setPendingInput}
          onSubmitInput={submitInput}
          onClockSpeedChange={(value) => {
            system.setClockSpeed(value);
            setState({ ...system.state });
          }}
          onPlay={() => setRunning(true)}
          onPause={() => setRunning(false)}
          onStep={stepProgram}
        />
        <RAMGrid memory={memory} mar={state.MAR} programCounter={state.programCounter} />
        <FDELog
          currentCycle={state.fdeCycleCount}
          loggingEnabled={loggingEnabled}
          onToggleLogging={setLoggingEnabled}
          logs={logs}
        />
      </main>
      <footer>
        <a href="https://github.com/[TBD]" target="_blank" rel="noreferrer">GitHub Repo [TBD]</a>
        <a href="https://www.linkedin.com/in/[TBD]" target="_blank" rel="noreferrer">LinkedIn [TBD]</a>
      </footer>
    </div>
  );
}
