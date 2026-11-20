import type { ComponentProps } from "react";
import { INPUT_MT_CLASS } from "@/shared/ui/fieldClasses";

interface Props extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: Props) {
  return (
    <label className="block text-left text-sm font-medium text-zinc-700">
      {label}
      <input className={INPUT_MT_CLASS} {...props} />
      {error ? <span className="mt-1 block text-xs font-normal text-red-600">{error}</span> : null}
    </label>
  );
}