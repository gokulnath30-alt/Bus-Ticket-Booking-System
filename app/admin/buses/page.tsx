"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, BusFront } from "lucide-react";

interface Bus {
  id: string;
  name: string;
  operatorId: string;
  route: string;
  schedule: string;
  fare: number;
  status: string;
  totalSeats: number;
  availableSeats: number;
}

export default function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    operator: "",
    from: "",
    to: "",
    date: "",
    time: "",
    fare: "",
  });

  const fetchBuses = async () => {
    try {
      const res = await fetch("http://localhost:5000/buses");
      if (res.ok) {
        const data = await res.json();
        setBuses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const addBus = async () => {
    if (!form.operator || !form.from || !form.to || !form.date || !form.time) {
      alert("Please fill necessary fields (Operator, From, To, Date, Time)");
      return;
    }

    const newBus = {
      name: form.operator,
      operatorId: "ADMIN",
      route: `${form.from} to ${form.to}`,
      schedule: `${form.date}T${form.time}`,
      fare: Number(form.fare) || 500,
      status: "Active",
      totalSeats: 40,
      availableSeats: 40,
    };

    try {
      const res = await fetch("http://localhost:5000/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBus),
      });

      if (res.ok) {
        fetchBuses();
        setForm({ operator: "", from: "", to: "", date: "", time: "", fare: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBus = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/buses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBuses(buses.filter((bus) => bus.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="panel-header">
        <h1>Bus Management</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        
        {/* ADD FORM */}
        <div className="admin-table-container" style={{ padding: "25px", height: "fit-content" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "var(--admin-text)", display: "flex", alignItems: "center", gap: "10px" }}>
            <BusFront size={20} color="var(--admin-primary)"/> Add New Bus
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input className="admin-input" placeholder="Operator Name" value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <input className="admin-input" placeholder="From (City)" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
              <input className="admin-input" placeholder="To (City)" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <input className="admin-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <input className="admin-input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <input className="admin-input" type="number" placeholder="Fare (₹)" value={form.fare} onChange={(e) => setForm({ ...form, fare: e.target.value })} />
            
            <button className="admin-btn" style={{ marginTop: "10px", justifyContent: "center" }} onClick={addBus}>
              <Plus size={18} /> Add Bus to Route
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="admin-table-container">
          {loading ? (
             <div style={{ padding: "40px", textAlign: "center", color: "var(--admin-text)" }}>Loading buses...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Route</th>
                  <th>Schedule & Fare</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--admin-text)" }}>No buses found. Add one to see it on the booking site.</td></tr>
                )}
                {buses.map((bus) => (
                  <tr key={bus.id}>
                    <td><strong>{bus.name}</strong><br/><span style={{fontSize: "12px", opacity: 0.6}}>ID: {String(bus.id).slice(0, 5)}</span></td>
                    <td>{bus.route}</td>
                    <td>
                      {bus.schedule.replace("T", " ")} <br/> 
                      <small style={{ color: "var(--admin-primary)" }}>₹{bus.fare || 0}</small>
                    </td>
                    <td>
                      <span style={{ 
                        background: bus.status === "Active" ? "rgba(46, 160, 67, 0.15)" : "rgba(88, 166, 255, 0.15)",
                        color: bus.status === "Active" ? "var(--admin-success)" : "var(--admin-primary)",
                        padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600"
                      }}>
                        {bus.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => deleteBus(bus.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--admin-danger)" }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
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