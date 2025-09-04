"use client";

import Link from "next/link";

export default function Menu() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex gap-6">
        <li>
          <Link href="/" className="hover:text-yellow-400">Home</Link>
        </li>
        <li>
          <Link href="/orders" className="hover:text-yellow-400">Orders</Link>
        </li>
      </ul>
    </nav>
  );
}
