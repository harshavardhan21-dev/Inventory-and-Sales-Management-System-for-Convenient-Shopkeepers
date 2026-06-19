// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-white">
          Stock<span className="text-emerald-500">Thozhan</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/stocks">Stocks</NavLink>
          <NavLink to="/sales">Daily Sales</NavLink>
          <NavLink to="/sales-history">Sales History</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </div>

        {/* USER + LOGOUT */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser && (
            <span className="text-zinc-500 text-xs truncate max-w-[160px]">
              {currentUser.email}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-700 text-zinc-300 hover:text-white transition"
          >
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 space-y-4">
          <MobileLink to="/" onClick={() => setOpen(false)}>
            Dashboard
          </MobileLink>

          <MobileLink to="/stocks" onClick={() => setOpen(false)}>
            Stocks
          </MobileLink>

          <MobileLink to="/sales" onClick={() => setOpen(false)}>
            Daily Sales
          </MobileLink>

          <MobileLink to="/sales-history" onClick={() => setOpen(false)}>
            Sales History
          </MobileLink>

          <MobileLink to="/settings" onClick={() => setOpen(false)}>
            Settings
          </MobileLink>

          <div className="pt-2 border-t border-zinc-800">
            {currentUser && (
              <p className="text-zinc-500 text-xs mb-3 truncate">
                {currentUser.email}
              </p>
            )}

            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="w-full text-sm py-2 rounded-lg bg-zinc-800 hover:bg-red-700 text-zinc-300 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-zinc-400 hover:text-emerald-400 transition"
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-zinc-300 hover:text-emerald-400 transition"
    >
      {children}
    </Link>
  );
}