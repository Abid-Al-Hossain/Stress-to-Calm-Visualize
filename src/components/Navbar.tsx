"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthService, User } from "../services/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  // Check auth state on mount and when interactions happen
  // In a real app, use a Context/Provider pattern or SWR/React Query
  useEffect(() => {
    setMounted(true);
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    // Check animation preference
    const pausedPref = localStorage.getItem("animation-paused") === "true";
    setIsPaused(pausedPref);
    if (pausedPref) {
      document.body.classList.add("animation-paused");
    }

    // Listen for storage events (e.g. login in another tab, or simple update from same tab if we dispatch event)
    const handleStorageChange = () => {
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, [pathname]); // Re-check on navigation

  const toggleAnimation = () => {
    const newState = !isPaused;
    setIsPaused(newState);
    localStorage.setItem("animation-paused", String(newState));
    if (newState) {
      document.body.classList.add("animation-paused");
    } else {
      document.body.classList.remove("animation-paused");
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
    router.refresh();
  };

  if (!mounted)
    return (
      <nav className="navbar">
        <div className="container nav-content">Loading...</div>
      </nav>
    );

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link href="/" className="nav-brand">
          Stress-to-Calm <span>Visualizer</span>
        </Link>

        <div className="nav-links">
          <button
            onClick={toggleAnimation}
            className="nav-link"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minWidth: "85px",
            }}
          >
            {isPaused ? <span>▶ Resume</span> : <span>⏸ Pause</span>}
          </button>

          {user ? (
            <>
              <span className="text-muted">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`nav-link ${pathname === "/login" ? "active" : ""}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
