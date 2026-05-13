import type { SubmitEvent } from "react";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useExampleStore } from "@/stores/example-store";

interface StorePersistenceFormInput {
  inputString: string;
}

export const Route = createFileRoute("/store-persistance")({
  component: StorePersistanceExampleComponent,
});

function StorePersistanceExampleComponent() {
  const [lastSubmittedString, setLastSubmittedString] = useState<string>();

  const exampleString = useExampleStore((state) => state.exampleString);
  const setExampleString = useExampleStore((state) => state.setExampleString);

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<StorePersistenceFormInput>();

  const storePersistenceFormsubmission: SubmitHandler<
    StorePersistenceFormInput
  > = (data) => {
    setExampleString(data.inputString);
    setLastSubmittedString(data.inputString);
  };

  const debouncedStorePersistenceFormsubmission = useDebouncedCallback<
    SubmitHandler<StorePersistenceFormInput>
  >(storePersistenceFormsubmission, 1000, {});

  const storeParagraph = (
    <>
      Current persisted string in store:
      <br />
      {exampleString}
    </>
  );
  const saveParagraph = `Persisted value updated to: ${lastSubmittedString}`;

  return (
    <div>
      <h3>Store Persistance Example</h3>
      <p>{storeParagraph}</p>
      <form onSubmit={handleSubmit(debouncedStorePersistenceFormsubmission)}>
        <label htmlFor="inputString">String to persist: </label>
        <input type="text" id="inputString" {...register("inputString")} />
        <input type="submit" />
      </form>
      {isSubmitSuccessful && <p>{saveParagraph}</p>}
    </div>
  );
}
