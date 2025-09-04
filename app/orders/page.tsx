"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getOrders, getLocations } from "@/server/orders";
import Papa from "papaparse";
import Menu from "@/components/menu";
// import { signIn, useSession } from "next-auth/react";

interface Order {
  id: string;
  customer: string;
  category: string;
  date: string;
  source: string;
  geo: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  // const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (status === "unauthenticated") signIn(); // redirect to login
  // }, [status]);

  // if (status === "loading") return <p>Loading...</p>;
  // if (!session) return null;

//filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [source, setSource] = useState<string | undefined>();
  const [geo, setGeo] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<string | undefined>();
  const [toDate, setToDate] = useState<string | undefined>();
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchLocations();
  }, [page, search, category, source, geo, fromDate, toDate]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(page, limit, search, category, source, geo, fromDate, toDate);
      setOrders(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    setLocations( await getLocations());
  }

  const totalPages = Math.ceil(total / limit);

  const exportCSV = async () => {
    try {
      let allData: number[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const res = await getOrders(currentPage, limit, search, category, source, geo, fromDate, toDate);
        allData = [...allData, ...res.data];
        totalPages = Math.ceil(res.total / limit);
        currentPage++;
      } while (currentPage <= totalPages);

      if (allData.length === 0) {
        alert("No data to export");
        return;
      }

      // Convert to CSV
      const csv = Papa.unparse(allData);

      // Download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Menu />
      <h1 className="text-2xl font-bold">Orders</h1>

        <Card className="p-4">
        <CardContent>
        {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <Select onValueChange={(v) => setCategory(v)} defaultValue={category}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(v) => setSource(v)} defaultValue={source}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Store">In-Store</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(v) => setGeo(v)} defaultValue={geo}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
                </SelectContent>
            </Select>

            <Input className="w-full" type="date" onChange={(e) => setFromDate(e.target.value)} />
            <Input className="w-full" type="date" onChange={(e) => setToDate(e.target.value)} />
            </div>

            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory(undefined);
                  setSource(undefined);
                  setGeo(undefined);
                  setFromDate(undefined);
                  setToDate(undefined);
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
                <Button onClick={exportCSV}>
                  Export CSV
                </Button>
            </div>
            
            {/* Orders Table */}
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Geo</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.source}</TableCell>
                    <TableCell>{order.geo}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                >
                Previous
                </Button>
                <span>
                Page {page} of {totalPages}
                </span>
                <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                >
                Next
                </Button>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
