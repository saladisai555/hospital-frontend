export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-ink">{label}</span>}
      <input
        className={`rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}
        {...props}
      />
      {error && <span className="text-danger">{error}</span>}
    </label>
  );
}