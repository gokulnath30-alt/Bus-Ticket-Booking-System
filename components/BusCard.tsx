import Link from "next/link";
import { Bus } from "../types/bus";

export default function BusCard({ bus }: { bus: Bus }) {
  return (
    <div className="bus-card">
      <h3>{bus.operator}</h3>
      <p>{bus.from} → {bus.to}</p>
      <p>{bus.time}</p>
      <p>₹{bus.fare}</p>
      <Link href={`/seat/${bus.id}`}>Select Seat</Link>
    </div>
  );
}