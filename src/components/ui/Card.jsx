export default function Card({ className = '', children }) {
  return (
    <div className={`rounded-lg border border-border bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}