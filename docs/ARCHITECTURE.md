# ARCHITECTURE

`src/core` contains pure TypeScript LMC logic (assembler + engine).
`src/components` contains UI components (Editor, CPU, RAM, Log).
`src/app/page.tsx` wires UI state to the engine in browser memory.
