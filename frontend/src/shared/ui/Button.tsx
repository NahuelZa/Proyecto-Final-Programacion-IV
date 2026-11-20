//Ayuda con IA
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

interface Props extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-violet-600 text-white hover:bg-violet-700",
  secondary: "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-lg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}