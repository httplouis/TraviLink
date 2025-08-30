import { cn } from "@/lib/utils";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary"|"ghost"|"danger"|"success";
};
export default function Button({ tone="primary", className, ...rest }: Props){
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition",
        tone==="primary" && "bg-brand-maroon text-white hover:bg-brand-maroon/90",
        tone==="ghost" && "border border-neutral-200 bg-white hover:bg-neutral-50",
        tone==="danger" && "bg-red-600 text-white hover:bg-red-700",
        tone==="success" && "bg-emerald-600 text-white hover:bg-emerald-700",
        className
      )}
    />
  );
}
