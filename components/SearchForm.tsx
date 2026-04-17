"use client";
import { useState } from "react";

interface SearchFormProps {
  onSearch: (from: string, to: string) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <center>
        <div className="us">
      <input placeholder="From" onChange={(e) => setFrom(e.target.value)} />
      <input placeholder="To" onChange={(e) => setTo(e.target.value)} />
      <button onClick={() => onSearch(from, to)}>Search</button>
    </div>
    </center>
  );
}