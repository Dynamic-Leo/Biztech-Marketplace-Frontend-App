import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/803cc2ffb6349e8daa522fcf852a00da8323a916.png";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="BizTech Logo" className="w-auto h-20" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/search"
              className="text-sm hover:text-[var(--color-accent)] transition-colors"
              style={{ color: "var(--color-text)" }}
            >
              Browse Businesses
            </Link>
            <Link
              to="/valuation"
              className="text-sm hover:text-[var(--color-accent)] transition-colors"
              style={{ color: "var(--color-text)" }}
            >
              Get Valuation
            </Link>

            {isAuthenticated ? (
              <>
                {/* NEW: Dashboard Link directly on Navbar */}
                <Link
                  to={`/dashboard/${user?.role}`}
                  className="text-sm hover:text-[var(--color-accent)] transition-colors"
                  style={{ color: "var(--color-text)" }}
                >
                  Dashboard
                </Link>

                {/* Existing Profile Dropdown (Simplified) */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
                    style={{ color: "var(--color-text)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#2EC4B6" }}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm">{user?.name || "User"}</p>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>
                        {getRoleLabel(user?.role)}
                      </p>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                      {/* REMOVED DASHBOARD LINK FROM HERE */}

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "var(--color-text)" }}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left"
                        style={{ color: "#EF4444" }}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-sm hover:text-[var(--color-accent)] transition-colors"
                  style={{ color: "var(--color-text)" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-6 py-2 rounded transition-all"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    borderRadius: "var(--radius-sharp)",
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--color-primary)" }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link
                to="/search"
                className="text-sm py-2"
                style={{ color: "var(--color-text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Businesses
              </Link>
              <Link
                to="/valuation"
                className="text-sm py-2"
                style={{ color: "var(--color-text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Valuation
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="py-2 border-t border-gray-100">
                    <p
                      className="text-sm mb-1"
                      style={{ color: "var(--color-text)" }}
                    >
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      {getRoleLabel(user?.role)}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/${user?.role}`}
                    className="text-sm py-2"
                    style={{ color: "var(--color-text)" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="text-sm py-2"
                    style={{ color: "var(--color-text)" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm px-4 py-2 rounded text-left"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "#EF4444",
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-sm py-2"
                    style={{ color: "var(--color-text)" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm px-6 py-2 rounded"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "white",
                      borderRadius: "var(--radius-sharp)",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
