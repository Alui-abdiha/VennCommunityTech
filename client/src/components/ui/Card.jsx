export default function Card({ className = "", ...props }) {
  return (
    <div
      className={`card-bg rounded-2xl border soft-border shadow-sm ${className}`}
      {...props}
    />
  );
}