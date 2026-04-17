"use client";

import { Users, BusFront, Banknote, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <div className="panel-header">
        <h1>Overview Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h3>Total Users</h3>
            <h2>1,248</h2>
          </div>
          <div className="metric-icon">
            <Users size={32} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Active Buses</h3>
            <h2>42</h2>
          </div>
          <div className="metric-icon" style={{ color: "#2ea043", background: "rgba(46, 160, 67, 0.1)" }}>
            <BusFront size={32} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <h2>₹84,500</h2>
          </div>
          <div className="metric-icon" style={{ color: "#f1e05a", background: "rgba(241, 224, 90, 0.1)" }}>
            <Banknote size={32} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Ongoing Trips</h3>
            <h2>8</h2>
          </div>
          <div className="metric-icon" style={{ color: "#d2a8ff", background: "rgba(210, 168, 255, 0.1)" }}>
            <Activity size={32} />
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        
        <div className="admin-table-container" style={{ padding: "20px" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "var(--admin-text)" }}>Recent Bookings</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Route</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sabeek</td>
                <td>Chennai → Madurai</td>
                <td><span style={{ color: "var(--admin-success)" }}>Confirmed</span></td>
                <td>₹850</td>
              </tr>
              <tr>
                <td>Sakthi</td>
                <td>Bangalore → Trichy</td>
                <td><span style={{ color: "var(--admin-success)" }}>Confirmed</span></td>
                <td>₹1,200</td>
              </tr>
              <tr>
                <td>Sankar</td>
                <td>Coimbatore → Chennai</td>
                <td><span style={{ color: "var(--admin-danger)" }}>Cancelled</span></td>
                <td>₹650</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="admin-table-container" style={{ padding: "20px" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "var(--admin-text)" }}>System Health</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", color: "var(--admin-text)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <span>Server Status</span>
               <span style={{ color: "var(--admin-success)" }}>Online</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <span>API Latency</span>
               <span>42ms</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <span>Database Load</span>
               <span style={{ color: "#f1e05a" }}>Moderate</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}