import Link from "next/link";
import { Bus, Users, BarChart3, LayoutDashboard, Settings, LogOut, Bell, Search } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Bus size={28} color="#58a6ff" />
          <span>Bus Admin</span>
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          <Link href="/admin/dashboard" className="sidebar-link">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/buses" className="sidebar-link">
            <Bus size={20} /> Bus Management
          </Link>
          <Link href="/admin/users" className="sidebar-link">
            <Users size={20} /> User Management
          </Link>
          <Link href="/admin/reports" className="sidebar-link">
            <BarChart3 size={20} /> Reports & Finance
          </Link>
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="#" className="sidebar-link" style={{ color: "#a7a8aac7" }}>
            <Settings size={20} /> Settings
          </Link>
          <Link href="/" className="sidebar-link" style={{ color: "#f85149" }}>
            <LogOut size={20} /> Log Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-title">Welcome back, Admin</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button className="admin-profile-btn" style={{ background: "transparent", border: "none" }}>
              <Search size={20} color="#c9d1d9" />
            </button>
            <button className="admin-profile-btn" style={{ background: "transparent", border: "none" }}>
              <Bell size={20} color="#c9d1d9" />
            </button>
            <button className="admin-profile-btn">
              <img src="https://ui-avatars.com/api/?name=Admin&background=58a6ff&color=fff" alt="Admin Profile" style={{ width: 28, height: 28, borderRadius: "50%" }} />
              Admin Profile
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
