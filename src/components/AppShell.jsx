import { NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AppShell({ navItems, roleLabel }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4.8 4.4A2.6 2.6 0 0 1 8.1 4l3.9 4-3.9 4a2.6 2.6 0 1 1-3.3-4 2.6 2.6 0 0 1 3.3-4Z" />
              <path d="M2 12h5.5l2-4 3 8 2-4H22" />
            </svg>
          </div>
          <span className="font-display font-semibold text-ink">Meridian Health</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-ink-muted hover:bg-paper hover:text-ink'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 mb-2">
            <p className="text-sm font-medium text-ink truncate">{user.name}</p>
            <p className="text-xs text-ink-muted">{roleLabel}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-ink-muted hover:bg-paper hover:text-danger transition-colors"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}