"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Bus, Ticket, LogOut, Plus, Trash2, Ban } from "lucide-react";
import { useRouter } from "next/navigation";

interface OperatorUser {
  email: string;
  role: string;
}

interface BusData {
  id: string | number;
  name: string;
  operatorId: string;
  route: string;
  schedule: string;
  fare: number;
  status: string;
  totalSeats: number;
  availableSeats: number;
}

interface BookingData {
  id: string | number;
  busId: string | number;
  customerName?: string;
  email?: string;
  customerEmail?: string;
  busName?: string;
  route?: string;
  seats?: string[];
  fareTotal?: number;
  totalAmount?: number;
  status?: string;
}

export default function OperatorDashboard() {
  const [operator, setOperator] = useState<OperatorUser | null>(null);
  const [activeTab, setActiveTab] = useState<"BUSES" | "BOOKINGS">("BUSES");
  
  // Data states
  const [buses, setBuses] = useState<BusData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [busForm, setBusForm] = useState({ name: "", from: "", to: "", date: "", time: "", fare: "" });

  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      // Ensure only operators or admins can access
      if (userObj.role !== "operator" && userObj.role !== "admin") { 
        router.push("/");
      } else {
        setOperator(userObj);
        fetchData(userObj.email);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchData = async (operatorEmail: string) => {
    setLoading(true);
    try {
      // 1. Fetch buses belonging to this specific operator
      const busRes = await fetch("http://localhost:5000/buses");
      if (busRes.ok) {
        const busData: BusData[] = await busRes.json();
        const myBuses = busData.filter((b: BusData) => b.operatorId === operatorEmail);
        setBuses(myBuses);
        
        // 2. Fetch bookings assigned to those specific bus IDs
        const bookRes = await fetch("http://localhost:5000/bookings");
        if (bookRes.ok) {
          const bookData: BookingData[] = await bookRes.json();
          const myBusIds = myBuses.map((b: BusData) => b.id);
          const myBookings = bookData.filter((bk: BookingData) => myBusIds.includes(bk.busId));
          setBookings(myBookings.reverse()); // Show newest first
        }
      }
    } catch (err) {
      console.error("Error fetching operator data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // --- BUS SERVICE MANAGEMENT ---
  const submitBus = async () => {
    if (!busForm.name || !busForm.from || !busForm.to || !busForm.date || !busForm.time) {
      alert("Please fill all required fields to add a service.");
      return;
    }

    const newBus = {
      name: busForm.name,
      operatorId: operator!.email, // Bind the bus strictly to this operator
      route: `${busForm.from} to ${busForm.to}`,
      schedule: `${busForm.date}T${busForm.time}`,
      fare: Number(busForm.fare) || 500,
      status: "Active",
      totalSeats: 40,
      availableSeats: 40
    };

    try {
      const res = await fetch("http://localhost:5000/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBus),
      });
      if (res.ok) {
        fetchData(operator!.email);
        setShowAddForm(false);
        setBusForm({ name: "", from: "", to: "", date: "", time: "", fare: "" });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create bus service.");
    }
  };

  const deleteBus = async (id: string | number) => {
    if (!confirm("Are you sure you want to completely delete this bus schedule?")) return;
    try {
      const res = await fetch(`http://localhost:5000/buses/${id}`, { method: "DELETE" });
      if (res.ok) fetchData(operator!.email);
    } catch (e) { console.error(e); }
  };

  // --- BOOKING & REFUND MANAGEMENT ---
  const cancelBooking = async (booking: BookingData) => {
    if (!confirm("Are you sure you want to refund this booking? This will cancel their ticket and release the seats back to available inventory.")) return;

    try {
      // 1. Update Booking Status to "Refunded"
      await fetch(`http://localhost:5000/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Refunded" }),
      });

      // 2. Automate Seat Release Logic
      const busToUpdate = buses.find(b => String(b.id) === String(booking.busId));
      if (busToUpdate && booking.seats && Array.isArray(booking.seats)) {
         const newAvailable = Number(busToUpdate.availableSeats) + booking.seats.length;
         await fetch(`http://localhost:5000/buses/${busToUpdate.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availableSeats: newAvailable }),
         });
      }

      fetchData(operator!.email);
      alert("Booking refunded and seats successfully restocked!");
    } catch (e) {
      console.error(e);
    }
  };

  if (!operator) return <div style={{height: "100vh", background: "#0d1117", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center"}}>Verifying credentials...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>
        {/* OPERATOR SIDEBAR */}
        <div style={{ width: "260px", background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "30px 20px", display: "flex", flexDirection: "column" }}>
          
          <div style={{ padding: "15px", background: "rgba(163, 113, 247, 0.1)", borderRadius: "12px", border: "1px solid rgba(163,113,247,0.2)", marginBottom: "30px" }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "16px" }}>Operator Console</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#a371f7", opacity: 0.9 }}>{operator.email}</p>
          </div>

          <button onClick={() => setActiveTab("BUSES")} style={{ background: activeTab === "BUSES" ? "rgba(163,113,247,0.15)" : "transparent", color: activeTab === "BUSES" ? "#fff" : "#8b949e", border: "none", padding: "12px 15px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", cursor: "pointer", textAlign: "left", marginBottom: "10px", transition: "0.2s", fontWeight: activeTab === "BUSES" ? "600" : "normal" }}>
            <Bus size={18} color={activeTab === "BUSES" ? "#a371f7" : "#8b949e"} /> Manage Deployments
          </button>
          
          <button onClick={() => setActiveTab("BOOKINGS")} style={{ background: activeTab === "BOOKINGS" ? "rgba(163,113,247,0.15)" : "transparent", color: activeTab === "BOOKINGS" ? "#fff" : "#8b949e", border: "none", padding: "12px 15px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", cursor: "pointer", textAlign: "left", marginBottom: "auto", transition: "0.2s", fontWeight: activeTab === "BOOKINGS" ? "600" : "normal" }}>
            <Ticket size={18} color={activeTab === "BOOKINGS" ? "#a371f7" : "#8b949e"} /> Bookings & Refunds
          </button>

          <button onClick={handleLogout} style={{ background: "transparent", color: "#f85149", border: "1px solid rgba(248,81,73,0.3)", padding: "12px 15px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", cursor: "pointer", marginTop: "20px" }}>
            <LogOut size={18} /> Logout Device
          </button>
        </div>

        {/* MAIN DASHBOARD PANEL */}
        <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          
          {loading ? (
             <div style={{ textAlign: "center", padding: "50px", opacity: 0.6 }}>Synchronizing Operator Data...</div>
          ) : activeTab === "BUSES" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                  <h1 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>Active Bus Fleet</h1>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.7 }}>Manage your schedules and monitor occupancy.</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#238636", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600", transition:"0.2s", boxShadow: "0 4px 12px rgba(35, 134, 54, 0.4)" }}>
                   <Plus size={18} /> {showAddForm ? "Cancel Creation" : "Add Service"}
                </button>
              </div>

              {/* DYNAMIC BUS FORM */}
              {showAddForm && (
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "25px", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.15)", marginBottom: "30px", animation: "fadeIn 0.3s" }}>
                  <h3 style={{ margin: "0 0 20px 0", color: "#fff" }}>Publish New Route Schedule</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <input style={{ padding: "14px", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", outline: "none" }} placeholder="Bus Identity (e.g. Acme Travels AVAC)" value={busForm.name} onChange={e => setBusForm({...busForm, name: e.target.value})} />
                    <input style={{ padding: "14px", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", outline: "none" }} placeholder="Fare Amount (₹)" type="number" value={busForm.fare} onChange={e => setBusForm({...busForm, fare: e.target.value})} />
                    <input style={{ padding: "14px", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", outline: "none" }} placeholder="Origin City" value={busForm.from} onChange={e => setBusForm({...busForm, from: e.target.value})} />
                    <input style={{ padding: "14px", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", outline: "none" }} placeholder="Destination City" value={busForm.to} onChange={e => setBusForm({...busForm, to: e.target.value})} />
                    <input style={{ padding: "14px", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", colorScheme: "dark", outline: "none" }} type="date" value={busForm.date} onChange={e => setBusForm({...busForm, date: e.target.value})} />
                    <input style={{ padding: "14px", background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", colorScheme: "dark", outline: "none" }} type="time" value={busForm.time} onChange={e => setBusForm({...busForm, time: e.target.value})} />
                  </div>
                  <button onClick={submitBus} style={{ background: "#a371f7", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "8px", fontWeight: "bold", marginTop: "20px", cursor: "pointer", transition: "background 0.2s" }}>
                    Confirm & Publish to Network
                  </button>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
                {buses.length === 0 && !showAddForm && (
                  <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                    <Bus size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: "15px" }} />
                    <h3 style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 10px 0" }}>Zero Active Fleet Deployments</h3>
                    <p style={{ margin: 0, opacity: 0.6 }}>You currently are not operating any buses. Hit Add Service up top to deploy.</p>
                  </div>
                )}
                
                {buses.map((b) => (
                  <div key={b.id} style={{ background: "rgba(255,255,255,0.03)", padding: "25px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
                     <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "#a371f7" }}></div>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                       <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>{b.name}</h3>
                       <span style={{ fontSize: "12px", padding: "4px 10px", background: "rgba(163,113,247,0.1)", color: "#a371f7", borderRadius: "10px", fontWeight: "bold" }}>{b.status}</span>
                     </div>
                     <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600", color: "#c9d1d9" }}>{b.route}</p>
                     <p style={{ margin: "0 0 20px 0", fontSize: "13px", opacity: 0.7 }}>Departure: {b.schedule ? b.schedule.replace("T", " ") : "N/A"}</p>
                     
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", background: "#0d1117", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                       <div>
                          <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "5px" }}>Available Seats</div>
                          <div style={{ fontSize: "18px", color: b.availableSeats > 5 ? "#fff" : "#f85149", fontWeight: "bold" }}>{b.availableSeats} / {b.totalSeats}</div>
                       </div>
                       <div>
                          <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "5px" }}>Seat Fare</div>
                          <div style={{ fontSize: "18px", color: "#3fb950", fontWeight: "bold" }}>₹{b.fare}</div>
                       </div>
                     </div>

                     <div style={{ marginTop: "20px" }}>
                        <button onClick={() => deleteBus(b.id)} style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(248,81,73,0.3)", color: "#f85149", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(248,81,73,0.1)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                          <Trash2 size={16} /> Delete Route
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                  <h1 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>Refunds & Booking Ledger</h1>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.7 }}>Manage customer tickets and automate refunds.</p>
                </div>
              </div>

              <div style={{ overflowX: "auto", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <th style={{ padding: "18px 20px", color: "#8b949e", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>Passenger</th>
                      <th style={{ padding: "18px 20px", color: "#8b949e", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>Fleet Reference</th>
                      <th style={{ padding: "18px 20px", color: "#8b949e", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>Finances</th>
                      <th style={{ padding: "18px 20px", color: "#8b949e", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>State</th>
                      <th style={{ padding: "18px 20px", color: "#8b949e", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 && <tr><td colSpan={5} style={{ padding: "50px", textAlign: "center", opacity: 0.5 }}>Zero bookings detected on your infrastructure.</td></tr>}
                    {bookings.map((bk) => (
                      <tr key={bk.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                          onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "20px" }}>
                          <div style={{ fontWeight: "600", color: "#fff", fontSize: "15px" }}>{bk.customerName || "Customer"}</div>
                          <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "4px" }}>{bk.customerEmail || bk.email || "No Email Associated"}</div>
                        </td>
                        <td style={{ padding: "20px" }}>
                          <div style={{ fontWeight: "600", color: "#a371f7" }}>{bk.busName}</div>
                          <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "4px" }}>{bk.route}</div>
                        </td>
                        <td style={{ padding: "20px" }}>
                          <div style={{ fontWeight: "600", color: "#fff", display: "flex", gap: "5px", flexWrap: "wrap", maxWidth: "150px" }}>
                             {bk.seats ? bk.seats.map((s: string) => <span key={s} style={{background:"rgba(255,255,255,0.1)", padding:"2px 6px", borderRadius:"4px", fontSize:"11px"}}>{s.replace('Seat ', '')}</span>) : "-"}
                          </div>
                          <div style={{ fontSize: "13px", color: "#3fb950", marginTop: "8px", fontWeight: "bold" }}>+ ₹{bk.fareTotal || bk.totalAmount || "0"}</div>
                        </td>
                        <td style={{ padding: "20px" }}>
                          {bk.status === "Refunded" ? (
                            <span style={{ padding: "6px 12px", background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)", color: "#f85149", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>Refunded</span>
                          ) : (
                            <span style={{ padding: "6px 12px", background: "rgba(46,160,67,0.15)", border: "1px solid rgba(46,160,67,0.3)", color: "#3fb950", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>Confirmed</span>
                          )}
                        </td>
                        <td style={{ padding: "20px" }}>
                          {bk.status !== "Refunded" ? (
                            <button onClick={() => cancelBooking(bk)} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(248,81,73,0.3)", color: "#f85149", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", display: "flex", gap: "6px", alignItems: "center", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(248,81,73,0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(0,0,0,0.3)"}>
                              <Ban size={14}/> Execute Refund
                            </button>
                          ) : (
                            <span style={{ color: "#8b949e", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}><Trash2 size={14}/> Assets Withdrawn</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
