"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./search.module.css";

export default function SearchPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/buses");
      if(res.ok) {
        const data = await res.json();
        setBuses(data);
        setResults(data); // Initially show all
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = buses.filter((bus) => {
      // The bus route is stored entirely in one string e.g. "Salem to Chennai"
      const routeLower = (bus.route || "").toLowerCase();
      const fromMatch = searchFrom ? routeLower.includes(searchFrom.toLowerCase()) : true;
      const toMatch = searchTo ? routeLower.includes(searchTo.toLowerCase()) : true;
      
      // Date matching
      let dateMatch = true;
      if (searchDate && bus.schedule) {
        const busDate = bus.schedule.split("T")[0]; // yyyy-mm-dd
        dateMatch = busDate === searchDate;
      }

      return fromMatch && toMatch && dateMatch;
    });

    setResults(filtered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Where to next?</h1>
          <p className={styles.heroSubtitle}>Find the perfect bus out of thousands of daily departures.</p>
          
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.inputGroup}>
              <label>Leaving From</label>
              <input 
                type="text" 
                placeholder="City Name"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Going To</label>
              <input 
                type="text" 
                placeholder="City Name"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Date</label>
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.searchButton}>
              Search Buses
            </button>
          </form>
        </div>
      </div>

      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>
          {results.length} {results.length === 1 ? 'Bus' : 'Buses'} Available
        </h2>

        {isLoading ? (
          <div className={styles.loading}>Loading buses...</div>
        ) : (
          <div className={styles.grid}>
            {results.map((bus) => (
              <div key={bus.id} className={styles.busCard}>
                <div className={styles.busHeader}>
                  <h3 className={styles.busName}>{bus.name}</h3>
                  <span className={styles.seatsBadge}>
                    {bus.availableSeats} Seats Left
                  </span>
                </div>
                
                <div className={styles.busRoute}>
                  {bus.route}
                </div>

                <div className={styles.busDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Departure</span>
                    <span className={styles.detailValue}>
                      {bus.schedule ? new Date(bus.schedule).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "Not Scheduled"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Operator ID</span>
                    <span className={styles.detailValue}>{bus.operatorId}</span>
                  </div>
                </div>

                <Link href={`/seat/${bus.id}`} className={styles.bookBtn}>
                  Select Seats
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && results.length === 0 && (
          <div className={styles.emptyState}>
            No buses matched your search criteria. Try modifying your route or date.
          </div>
        )}
      </div>
    </div>
  );
}