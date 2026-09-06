export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4.8 4.4A2.6 2.6 0 0 1 8.1 4l3.9 4-3.9 4a2.6 2.6 0 1 1-3.3-4 2.6 2.6 0 0 1 3.3-4Z" />
              <path d="M2 12h5.5l2-4 3 8 2-4H22" />
            </svg>
          </div>
          <span className="font-display font-semibold text-lg text-ink">Meridian Health</span>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h1 className="font-display font-semibold text-xl text-ink mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}