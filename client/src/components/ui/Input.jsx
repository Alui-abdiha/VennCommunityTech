export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border soft-border bg-[rgb(var(--card))] px-3 py-2 text-[rgb(var(--fg))] outline-none placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-[rgb(var(--brand))]/20 ${className}`}
      {...props}
    />
  );
}