import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { until } from "until-async";

export const Route = createFileRoute("/tauri-example")({
  component: TauriExampleComponent,
});

function TauriExampleComponent() {
  const [rustString, setRustString] = useState<string>("");

  const rustParagraph = `Rust string: ${rustString}`;

  const callTauri = useCallback(async () => {
    const [error, returnString] = await until<NonNullable<unknown>, string>(
      () => invoke<string>("example_rust_string"),
    );
    setRustString(error != null ? "Rust Error" : returnString);
  }, []);

  return (
    <div>
      <h3>Tauri Example</h3>
      <p>
        This button will call a Tauri function, and the returned string result
        will be displayed below
      </p>
      <button type="button" onClick={callTauri}>
        Call Tauri Function
      </button>
      <p>{rustParagraph}</p>
    </div>
  );
}
