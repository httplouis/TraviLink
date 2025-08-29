type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md";
};

export default function Button({ variant="solid", size="md", className="", ...rest }: Props) {
  const base = "rounded-full font-medium transition outline-none focus:ring-2 focus:ring-brand-maroon/30 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1 text-sm", md: "px-4 py-2" }[size];
  const variants = {
    solid:   "bg-brand-maroon text-white hover:bg-brand-maroon/90",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    ghost:   "text-slate-700 hover:bg-slate-100",
  }[variant];
  return <button className={`${base} ${sizes} ${variants} ${className}`} {...rest} />;
}
