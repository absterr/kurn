"use client";
import { useActionState } from "react";
import { type FormState, submitForm } from "@/actions";
import SubmitButton from "./SubmitButton";

const initialState: FormState = {
  keyword: "",
  location: "",
};

const LeadsForm = () => {
  const [state, formAction] = useActionState(submitForm, initialState);

  return (
    <form action={formAction} className="flex flex-col md:flex-row gap-4">
      <div>
        <input
          name="keyword"
          placeholder="keyword"
          className="w-full p-2 bg-background"
        />
        {state.errors?.keyword && (
          <p className="text-red-500 text-sm">{state.errors.keyword[0]}</p>
        )}
      </div>

      <div>
        <input
          name="location"
          placeholder="Location"
          className="w-full p-2 bg-background"
        />
        {state.errors?.location && (
          <p className="text-red-500 text-sm">{state.errors.location[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
};

export default LeadsForm;
