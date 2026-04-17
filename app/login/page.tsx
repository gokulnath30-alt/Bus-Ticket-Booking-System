"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(email.trim())}`
      );

      const data = await res.json();

      if (data.length > 0 && data[0].password === password) {
        const user = data[0];

        localStorage.setItem("user", JSON.stringify(user));

        alert("Login successful!");

        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "operator") {
          router.push("/operator");
        } else {
          router.push("/customer");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={{ color: "black" }}>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={{ color: "black" }}>
          Don&apos;t have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#634770d2",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    width: "300px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
  },
  input: {
    padding: "10px",
    margin: 0,
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    margin: 0,
    width: "100%",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};