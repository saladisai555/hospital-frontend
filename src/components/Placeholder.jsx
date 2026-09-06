export default function Placeholder({ title }) {
  return (
    <div className="border border-dashed border-border rounded-lg p-10 text-center">
      <p className="font-display text-ink font-medium mb-1">{title}</p>
      <p className="text-sm text-ink-muted">This screen is built in an upcoming step.</p>
    </div>
  );
}