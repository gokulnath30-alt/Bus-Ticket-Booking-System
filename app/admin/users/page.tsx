"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, User as UserIcon, Trash2, Mail } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "user";
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Enter user email and password");
      return;
    }

    const newUser = {
      name: name.trim() || undefined,
      email,
      password,
      role,
    };

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      
      if (res.ok) {
        fetchUsers();
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
      }
    } catch (err) {
      console.error("Error creating user", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <div>
      <div className="panel-header">
        <h1>User Management</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        
        {/* ADD USER CARD */}
        <div className="admin-table-container" style={{ padding: "25px", height: "fit-content" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "var(--admin-text)", display: "flex", alignItems: "center", gap: "10px" }}>
            <UserPlus size={20} color="var(--admin-primary)"/> Add New User
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input className="admin-input" placeholder="Full Name (Optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid var(--admin-border)", padding: "0 10px" }}>
               <Mail size={16} color="var(--admin-text)" />
               <input className="admin-input" style={{ border: "none", background: "transparent", flexGrow: "1", boxShadow:"none" }} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <input className="admin-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select className="admin-input" value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}>
               <option value="user">Standard User</option>
               <option value="admin">Administrator</option>
            </select>
            <button className="admin-btn" style={{ marginTop: "10px", justifyContent: "center" }} onClick={addUser}>
               Create Account
            </button>
          </div>
        </div>

        {/* USERS LIST */}
        <div className="admin-table-container">
          {loading ? (
             <div style={{ padding: "40px", textAlign: "center", color: "var(--admin-text)" }}>Loading users...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--admin-text)" }}>No users found.</td></tr>
                )}
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ background: "var(--admin-sidebar)", padding: "10px", borderRadius: "50%", color: "var(--admin-text)" }}>
                          {u.role === "admin" ? <Shield size={20} color="var(--admin-primary)"/> : <UserIcon size={20} />}
                        </div>
                        <div>
                           <div style={{ fontWeight: "600", color: "var(--admin-heading)" }}>{u.name || "No Name Provided"}</div>
                           <div style={{ fontSize: "13px", color: "var(--admin-text)" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        background: u.role === "admin" ? "rgba(88, 166, 255, 0.15)" : "rgba(201, 209, 217, 0.1)",
                        color: u.role === "admin" ? "var(--admin-primary)" : "var(--admin-text)",
                        padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase"
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                       <button onClick={() => deleteUser(u.id)} style={{ background: "rgba(248, 81, 73, 0.1)", border: "1px solid rgba(248,81,73,0.3)", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", color: "var(--admin-danger)", display: "flex", gap: "5px", alignItems: "center" }}>
                          <Trash2 size={16} /> Remove
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}