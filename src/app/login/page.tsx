"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AuthService } from "../../services/auth";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await AuthService.login(email, password);
      // Trigger update in Navbar
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <motion.div
        className="auth-card"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h2
          className="text-center"
          style={{ marginBottom: "2rem" }}
          variants={itemVariants}
        >
          Welcome Back
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{
              background: "#FDEDEC",
              color: "#E74C3C",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              required
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              required
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-full mt-4"
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <motion.p
          className="text-center mt-4 text-muted"
          style={{ fontSize: "0.9rem" }}
          variants={itemVariants}
        >
          Don't have an account? <Link href="/register">Sign up</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
