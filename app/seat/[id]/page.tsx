"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./seat.module.css";

export default function SeatPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bus, setBus] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [step, setStep] = useState<"SELECT" | "PAYMENT" | "SUCCESS">("SELECT");
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded fake fare per seat for demonstration (API bus model didn't include fare in Operator stage)
  const FARE_PER_SEAT = 550; 

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchBus();
  }, [id]);

  const fetchBus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/buses/${id}`);
      if(res.ok) {
        const data = await res.json();
        setBus(data);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeat = (seatNo: number) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    setStep("PAYMENT");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingPayload = {
      busId: bus.id,
      busName: bus.name,
      route: bus.route,
      userId: user.id,
      email: user.email,
      customerEmail: user.email,
      customerName: user.name || user.email,
      seats: selectedSeats.map(s => `Seat ${s + 1}`),
      status: "Active",
      fareTotal: selectedSeats.length * FARE_PER_SEAT,
      bookedAt: new Date().toISOString()
    };

    try {
      await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      setStep("SUCCESS");
      
      // Update bus availability
      const updatedAvailable = bus.availableSeats - selectedSeats.length;
      await fetch(`http://localhost:5000/buses/${bus.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableSeats: updatedAvailable })
      });
      
      setTimeout(() => {
        router.push("/customer");
      }, 3000);
    } catch(e) {
       alert("Failed to process payment. Please try again.");
    }
  };

  if (isLoading) return <div style={{textAlign: "center", padding: "5rem"}}>Loading bus details...</div>;
  if (!bus) return <div style={{textAlign: "center", padding: "5rem"}}>Bus not found.</div>;

  // Mocking already booked seats. In a real scenario, this would come from the server's bookings table.
  const totalSeats = bus.totalSeats;
  const bookedCount = totalSeats - bus.availableSeats;
  const mockBookedSeats = new Set(Array.from({length: bookedCount}, (_, i) => i)); // dummy simulation

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {step === "SELECT" && (
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>{bus.name}</h1>
              <p className={styles.subtitle}>{bus.route}</p>
            </div>

            <div className={styles.busContainer}>
               {Array.from({ length: Math.ceil(totalSeats / 5) }).map((_, rowIndex) => {
                  return (
                    <div key={rowIndex} className={styles.row}>
                      <div className={styles.side}>
                        {[0, 1].map((seatOffset) => {
                          const seatNumber = rowIndex * 5 + seatOffset;
                          if (seatNumber >= totalSeats) return <div key={seatNumber} style={{width: '45px'}}/>;
                          
                          const isBooked = mockBookedSeats.has(seatNumber);
                          const isSelected = selectedSeats.includes(seatNumber);

                          return (
                            <div
                              key={seatNumber}
                              className={`
                                ${styles.seat} 
                                ${isBooked ? styles.seatBooked : ''} 
                                ${isSelected ? styles.seatSelected : ''}
                              `}
                              onClick={() => !isBooked && toggleSeat(seatNumber)}
                            >
                              {seatNumber + 1}
                            </div>
                          );
                        })}
                      </div>

                      <div className={styles.aisle}></div>

                      <div className={styles.side}>
                        {[2, 3, 4].map((seatOffset) => {
                          const seatNumber = rowIndex * 5 + seatOffset;
                          if (seatNumber >= totalSeats) return <div key={seatNumber} style={{width: '45px'}}/>;
                          
                          const isBooked = mockBookedSeats.has(seatNumber);
                          const isSelected = selectedSeats.includes(seatNumber);

                          return (
                            <div
                              key={seatNumber}
                              className={`
                                ${styles.seat} 
                                ${isBooked ? styles.seatBooked : ''} 
                                ${isSelected ? styles.seatSelected : ''}
                              `}
                              onClick={() => !isBooked && toggleSeat(seatNumber)}
                            >
                              {seatNumber + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.box} style={{background: "#cbd5e1"}}></span> Available
              </div>
              <div className={styles.legendItem}>
                <span className={styles.box} style={{background: "#10b981"}}></span> Selected
              </div>
              <div className={styles.legendItem}>
                <span className={styles.box} style={{background: "#ef4444", opacity: 0.7}}></span> Booked
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className={styles.summarySection}>
                <div className={styles.summaryRow}>
                  <span>Seats Selected:</span>
                  <span>{selectedSeats.map(s => s + 1).join(", ")}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Fare pre seat (Mocked):</span>
                  <span>₹{FARE_PER_SEAT}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total Amount:</span>
                  <span>₹{selectedSeats.length * FARE_PER_SEAT}</span>
                </div>
                
                <button 
                  className={styles.actionBtn}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        )}

        {step === "PAYMENT" && (
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Secure Payment</h1>
              <p className={styles.subtitle}>Complete your booking for ₹{selectedSeats.length * FARE_PER_SEAT}</p>
            </div>

            <form className={styles.paymentForm} onSubmit={handlePaymentSubmit}>
              <div className={styles.inputGroup}>
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Card Number</label>
                <input type="text" placeholder="4111 2222 3333 4444" required maxLength={16} />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required maxLength={5} />
                </div>
                <div className={styles.inputGroup}>
                  <label>CVV</label>
                  <input type="password" placeholder="123" required maxLength={3} />
                </div>
              </div>

              <button type="submit" className={styles.actionBtn}>
                Pay ₹{selectedSeats.length * FARE_PER_SEAT}
              </button>
              
              <button 
                type="button" 
                className={styles.actionBtn} 
                style={{backgroundColor: "#cbd5e1", color: "#334155", marginTop: "1rem"}}
                onClick={() => setStep("SELECT")}
              >
                Back to Seats
              </button>
            </form>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className={styles.card}>
             <div className={styles.successState}>
                <div className={styles.checkIcon}>✓</div>
                <h1 className={styles.title}>Booking Confirmed!</h1>
                <p className={styles.subtitle}>Your tickets have been successfully booked.</p>
                <p style={{marginTop: "1rem", color: "#64748b"}}>Redirecting to your dashboard...</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}