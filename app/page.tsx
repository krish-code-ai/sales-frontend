"use client";

import Menu from "@/components/menu";
import dynamic from "next/dynamic";
const Charts = dynamic(() => import("./orders/charts"), { ssr: false });

export default function Home() {
  
  return (
    <div>
      <h4 className="text-3xl font-bold underline">Dash Board</h4>
      <Menu />
      <Charts />
    </div>
  );
}
