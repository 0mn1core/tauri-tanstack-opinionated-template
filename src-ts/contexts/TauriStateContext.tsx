/* Type Imports */
import type { ReactNode } from "react";
import type { UnlistenFn } from "@tauri-apps/api/event";

import { createContext, useContext, useState } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";

interface TauriStateContextType {
  get: <T extends {}>(key: string) => Promise<T | undefined>;
  set: (key: string, value: unknown) => Promise<void>;
  onKeyChange: (
    key: string,
    cb: (value: unknown) => void,
  ) => Promise<UnlistenFn>;
}

interface TauriStateProviderProps {
  children: ReactNode;
}

const TauriStateContext = createContext<TauriStateContextType | undefined>(
  undefined,
);

export function TauriStateProvider({ children }: TauriStateProviderProps) {
  // Lazy initialization
  const [store] = useState(() => new LazyStore("state.json"));

  const get = async <T extends {}>(key: string): Promise<T | undefined> => {
    return await store.get<T>(key);
  };

  const set = async (key: string, value: unknown): Promise<void> => {
    return await store.set(key, value);
  };

  const onKeyChange = (
    key: string,
    cb: (value: unknown) => void,
  ): Promise<UnlistenFn> => {
    return store.onKeyChange(key, cb);
  };

  const value = { get, set, onKeyChange };

  return (
    <TauriStateContext.Provider value={value}>
      {children}
    </TauriStateContext.Provider>
  );
}

export function useTauriState(): TauriStateContextType {
  const context = useContext(TauriStateContext);
  if (context === undefined) {
    throw new Error("useTauriState called outside of TauriStateProvider");
  }
  return context;
}
