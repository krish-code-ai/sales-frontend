"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types for the summary payload returned by the backend
interface SummaryItem { name: string; count: number }
interface DailyItem { date: string; count: number }
interface SummaryResponse {
  byCategory: SummaryItem[];
  byDate: DailyItem[];
  bySource: SummaryItem[];
  byGeo?: SummaryItem[];
}

const API_URL = process.env.BACKEND_APP_URL;

export default function OrdersCharts() {
  // Filters (match your table’s filters)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [source, setSource] = useState<string | undefined>();
  const [geo, setGeo] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<string | undefined>();
  const [toDate, setToDate] = useState<string | undefined>();

  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category) p.set("category", category);
    if (source) p.set("source", source);
    if (geo) p.set("geo", geo);
    if (fromDate) p.set("from_date", fromDate);
    if (toDate) p.set("to_date", toDate);
    return p.toString();
  }, [search, category, source, geo, fromDate, toDate]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/orders/summary?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch summary");
      const json: SummaryResponse = await res.json();
      setData(json);
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Unknown error");
        }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  const clearFilters = () => {
    setSearch("");
    setCategory(undefined);
    setSource(undefined);
    setGeo(undefined);
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Orders Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
          <Button onClick={fetchSummary} disabled={loading}>Refresh</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />

            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Toys">Toys</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSource} value={source}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Store">Store</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setGeo} value={geo}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Houston">Houston</SelectItem>
                <SelectItem value="Miami">Miami</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="Dallas">Dallas</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" value={fromDate || ""} onChange={(e) => setFromDate(e.target.value)} className="w-full" />
            <Input type="date" value={toDate || ""} onChange={(e) => setToDate(e.target.value)} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {error && (<div className="text-red-600 text-sm">{error}</div>)}
      {loading && (<div className="text-sm">Loading charts…</div>)}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category (Bar) */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Orders by Category</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.byCategory || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Orders" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Over Time (Line) */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Orders over Time</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.byDate || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Orders" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Source (Pie) */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Orders by Source</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={data?.bySource || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {(data?.bySource || []).map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
