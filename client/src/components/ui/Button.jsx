export default function Button({ className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-sm hover:opacity-90 ${className}`}
      {...props}
    />
  );
}

