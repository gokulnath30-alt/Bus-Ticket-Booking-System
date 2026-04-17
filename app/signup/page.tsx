"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if user already exists
      const checkRes = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(email.trim())}`
      );
      const existingUser = await checkRes.json();

      if (existingUser.length > 0) {
        alert("User already exists!");
        return;
      }

      // Create new user
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user",
        }),
      });

      if (res.ok) {
        alert("Signup successful!");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Error signing up");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={{ color: "black" }}>Signup</h2>

        <input
          type="name"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />

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
          Signup
        </button>
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
    backgroundColor: "#6a5acd",
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