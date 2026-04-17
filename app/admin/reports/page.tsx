"use client";

import { useState } from "react";
import { DownloadCloud, TrendingUp, Presentation, AlertCircle } from "lucide-react";

interface Report {
  totalBookings: number;
  revenue: number;
  popularRoute: string;
  cancelRate: number;
}

export default function Reports() {
  const [report] = useState<Report>({
    totalBookings: 1248,
    revenue: 1250000,
    popularRoute: "Chennai → Madurai",
    cancelRate: 4.2
  });

  return (
    <div>
      <div className="panel-header">
        <h1>Reports & Finance</h1>
        <button className="admin-btn">
          <DownloadCloud size={18} /> Export Full Report
        </button>
      </div>

      <div className="metric-grid">
        <div className="metric-card" style={{ borderColor: "var(--admin-primary)" }}>
          <div className="metric-info">
             <h3 style={{ color: "var(--admin-primary)" }}>Total Year Revenue</h3>
             <h2 style={{ fontSize: "40px" }}>₹{report.revenue.toLocaleString()}</h2>
          </div>
          <div className="metric-icon" style={{ background: "rgba(88, 166, 255, 0.2)", padding: "20px" }}>
             <TrendingUp size={40} />
          </div>
        </div>

        <div className="metric-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--admin-text)" }}>
             <Presentation size={24} /> <h3>Most Popular Route</h3>
           </div>
           <h2>{report.popularRoute}</h2>
           <span style={{ fontSize: "14px", color: "var(--admin-success)" }}>Accounts for 35% of traffic</span>
        </div>

        <div className="metric-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--admin-danger)" }}>
             <AlertCircle size={24} /> <h3>Cancellation Rate</h3>
           </div>
           <h2 style={{ color: "var(--admin-danger)" }}>{report.cancelRate}%</h2>
           <span style={{ fontSize: "14px", color: "var(--admin-text)" }}>Needs reduction below 3%</span>
        </div>
      </div>

      <div className="admin-table-container" style={{ padding: "30px", marginTop: "30px" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "var(--admin-text)" }}>Monthly Revenue Bracket (Mock Graph Data)</h3>
          <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "15px", borderBottom: "1px solid var(--admin-border)" }}>
             {/* Mock Chart Bars */}
             {[40, 60, 50, 80, 75, 95, 120].map((height, i) => (
               <div key={i} style={{ flexGrow: "1", height: `${height}%`, background: "var(--admin-primary)", borderRadius: "6px 6px 0 0", transition: "0.3s" }} className="chart-bar-hover"></div>
             ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: "var(--admin-text)", fontSize: "14px", fontWeight: "bold" }}>
             <span>Jan</span> <span>Feb</span> <span>Mar</span> <span>Apr</span> <span>May</span> <span>Jun</span> <span>Jul</span>
          </div>
      </div>
    </div>
  );
}