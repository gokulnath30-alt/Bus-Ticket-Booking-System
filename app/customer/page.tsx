"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { User, Ticket, LogOut, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CustomerUser {
  name?: string;
  email: string;
  role: string;
}

interface Booking {
  id: string | number;
  customerEmail?: string;
  email?: string;
  busName?: string;
  from?: string;
  to?: string;
  date?: string;
  seats?: string[] | number[];
  totalFare?: number;
  totalAmount?: number;
  route?: string;
  bookedAt?: string;
  fareTotal?: number;
}

export default function CustomerDashboard() {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();

  const fetchBookings = async (email: string) => {
    try {
      const res = await fetch("http://localhost:5000/bookings");
      if (res.ok) {
        const data = await res.json();
        // Filter bookings by the logged-in customer's email
        const myBookings = data.filter((b: Booking) => b.customerEmail === email || b.email === email);
        setBookings(myBookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    // Check local storage for logged-in user
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      // Redirect admins away from customer dashboard
      if (userObj.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        setCurrentUser(userObj);
        fetchBookings(userObj.email);
      }
    } else {
      // If not logged in, redirect to login page
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!currentUser) return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "white", background: "#0d1117" }}>
      Loading your dashboard...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>

        {/* DASHBOARD HEADER */}
        <div style={{
          background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "16px",
          backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "#58a6ff", padding: "18px", borderRadius: "50%", display: "flex", boxShadow: "0 0 20px rgba(88, 166, 255, 0.4)" }}>
              <User size={30} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: "0", fontSize: "28px", color: "#fff" }}>Welcome, {currentUser.name || currentUser.email.split('@')[0]}!</h1>
              <p style={{ margin: "5px 0 0 0", opacity: 0.7, fontSize: "16px" }}>Your Personal Customer Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(248, 81, 73, 0.1)", border: "1px solid rgba(248, 81, 73, 0.4)",
              color: "#f85149", padding: "12px 24px", borderRadius: "10px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: "600", transition: "0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(248, 81, 73, 0.2)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(248, 81, 73, 0.1)"}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* BOOKINGS SECTION */}
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", color: "#fff", fontSize: "24px" }}>
          <Ticket size={28} color="#58a6ff" /> My Bookings
        </h2>

        {bookings.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 20px", background: "rgba(255,255,255,0.02)",
            borderRadius: "16px", border: "2px dashed rgba(255,255,255,0.1)"
          }}>
            <Clock size={56} color="rgba(255,255,255,0.3)" style={{ marginBottom: "20px" }} />
            <h3 style={{ margin: "0 0 10px 0", fontSize: "22px", color: "#fff" }}>No Bookings Found</h3>
            <p style={{ opacity: 0.7, margin: "0 0 30px 0", fontSize: "16px" }}>You haven't booked any bus tickets yet. Start exploring routes today!</p>
            <Link href="/search" style={{
              background: "#238636", color: "#fff", padding: "14px 30px", borderRadius: "10px",
              textDecoration: "none", display: "inline-block", fontWeight: "600", fontSize: "16px",
              boxShadow: "0 4px 15px rgba(35, 134, 54, 0.4)"
            }}>
              Find a Bus
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "30px" }}>
            {bookings.map((booking, idx) => (
              <div key={idx} style={{
                background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "25px",
                border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden",
                transition: "transform 0.2s", cursor: "default"
              }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #58a6ff, #d2a8ff)" }}></div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "25px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#fff", fontSize: "20px" }}>{booking.busName || "Express Travels"}</h3>
                    <div style={{ fontSize: "14px", opacity: 0.6, letterSpacing: "1px" }}>TICKET #{booking.id ? String(booking.id).slice(0, 8).toUpperCase() : `PENDING-${idx}`}</div>
                  </div>
                  <span style={{
                    display: "flex", alignItems: "center", gap: "6px", background: "rgba(46, 160, 67, 0.15)",
                    color: "#3fb950", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", border: "1px solid rgba(46, 160, 67, 0.3)"
                  }}>
                    <CheckCircle size={14} /> Confirmed
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ opacity: 0.6, fontSize: "14px" }}>Route</span>
                    <span style={{ fontWeight: "600", color: "#fff" }}>{booking.route ? booking.route.replace(/ to /gi, " → ") : (booking.from ? `${booking.from} → ${booking.to || ""}` : "Unknown Route")}</span>
                  </div>
                  <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.05)" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ opacity: 0.6, fontSize: "14px" }}>Date</span>
                    <span style={{ fontWeight: "600", color: "#fff" }}>{booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : (booking.date || "Upcoming")}</span>
                  </div>
                  <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.05)" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ opacity: 0.6, fontSize: "14px" }}>Seats</span>
                    <span style={{ fontWeight: "600", color: "#fff", maxWidth: "250px", textAlign: "right" }}>
                      {booking.seats ? booking.seats.map(s => String(s).replace(/[^0-9]/g, '') ? `Seat ${String(s).replace(/[^0-9]/g, '')}` : s).join(", ") : "Not Assigned"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ opacity: 0.6, fontSize: "14px" }}>Total Paid</span>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
                    ₹{booking.fareTotal || booking.totalFare || booking.totalAmount || "0"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
