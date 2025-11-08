import React from "react";
import { POOLS } from "../config";
import PoolCard from "./PoolCard";

export default function PoolsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {POOLS.map(p => <PoolCard key={p.id} pool={p} />)}
    </div>
  );
}
