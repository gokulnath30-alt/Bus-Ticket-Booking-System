import Link from "next/link";
import { Bus, Home, Search, User, LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass-nav">

      <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "white", fontSize: "30px", fontWeight: "bold" }}>
        <Bus size={35} color="#58a6ff" />
        <span>Bus Ticket Booking</span>
      </div>

      <div className="glass-nav-links">
        <Link href="/">
          <Home size={20} /> Home
        </Link>
        <Link href="/search">
          <Search size={20} /> Search Routes
        </Link>
        <Link href="/login" className="glass-btn" style={{ marginLeft: "15px" }}>
          <LogIn size={20} /> Sign In
        </Link>
      </div>
    </nav>
  );
}