import type { ReactNode } from "react";

interface Props {
  titulo: string;
  children: ReactNode;
}

export function Modal({ titulo, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-xl">
        <h3 className="text-base font-semibold text-zinc-900">{titulo}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}