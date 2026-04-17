import Navbar from "../components/Navbar";
import { ArrowRight, MapPin, Calendar, ShieldCheck, Zap, Headphones } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      
      <div className="hero-container">
        
        {/* Glassmorphic Search Hero Widget */}
        <div className="glass-card">
          <h1 className="hero-title">Journey Beyond Boundaries</h1>
          <p className="hero-subtitle">
            Welcome To Bus Ticket Booking 
          </p>

          <div className="route-search">
             <div style={{ display: "flex", flexGrow: "1", gap: "10px" }}>
                <div style={{ position: "relative", flexGrow: "1" }}>
                   <MapPin size={20} color="#666" style={{ position: "absolute", left: "15px", top: "15px" }} />
                   <input className="route-input" style={{ paddingLeft: "45px" }} placeholder="Leaving from..." />
                </div>
                <div style={{ position: "relative", flexGrow: "1" }}>
                   <MapPin size={20} color="#666" style={{ position: "absolute", left: "15px", top: "15px" }} />
                   <input className="route-input" style={{ paddingLeft: "45px" }} placeholder="Going to..." />
                </div>
                <div style={{ position: "relative", width: "200px" }}>
                   <Calendar size={20} color="#666" style={{ position: "absolute", left: "15px", top: "15px" }} />
                   <input type="date" className="route-input" style={{ paddingLeft: "45px" }} />
                </div>
             </div>
             <Link href="/search" className="glass-btn" style={{ height: "100%", padding: "15px 30px", fontSize: "18px", display: "flex", gap: "10px" }}>
                 Search <ArrowRight size={20} />
             </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="features-grid">
           <div className="feature-item">
              <ShieldCheck size={40} color="#58a6ff" />
              <h3 style={{ margin: 0, fontSize: "18px" }}>Secure Checkout</h3>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>Your payments are encrypted and strictly protected.</p>
           </div>
           <div className="feature-item">
              <Zap size={40} color="#f1e05a" />
              <h3 style={{ margin: 0, fontSize: "18px" }}>Instant Booking</h3>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>Skip the line and receive your digital ticket instantly.</p>
           </div>
           <div className="feature-item">
              <Headphones size={40} color="#d2a8ff" />
              <h3 style={{ margin: 0, fontSize: "18px" }}>24/7 Support</h3>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>Our dedicated customer service team is always here to help.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
