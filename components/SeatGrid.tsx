"use client";

export default function SeatGrid({
  seats,
  onSelect,
}: {
  seats: boolean[];
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 50px)" }}>
      {seats.map((s, i) => (
        <button
          key={i}
          className={`seat ${s ? "booked" : "available"}`}
          onClick={() => onSelect(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}