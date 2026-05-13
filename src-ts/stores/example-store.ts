import { create } from "zustand";
import { createTauriStore } from "@tauri-store/zustand";

type ExampleStore = {
  exampleString: string;
  setExampleString: (setString: string) => void;
};

export const useExampleStore = create<ExampleStore>((set) => ({
  exampleString: "JS Initialized String",
  setExampleString: (setString: string) =>
    set((_state) => ({ exampleString: setString })),
}));

// A handle to the Tauri plugin.
// We will need this to start the store.
export const tauriHandler = createTauriStore("example", useExampleStore, {
  autoStart: true,
  saveOnChange: true,
  saveStrategy: "debounce",
  saveInterval: 1000,
});
