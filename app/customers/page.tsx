"use client";

import { useState, useEffect } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/server/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<{id:number,name:string}[]>([]);
  const [newName, setNewName] = useState('');
  const [editCus, setEditCus] = useState<{id:number,name:string} | null>(null);

  const load = async()=> setCustomers(await getCustomers());
  useEffect(()=>{ load() }, []);

  const handleAdd = async()=>{ if(!newName) return; await createCustomer({name:newName}); setNewName(''); load(); }
  const handleUpdate = async()=>{ if(editCus){ await updateCustomer(editCus.id,{name:editCus.name}); setEditCus(null); load(); } }
  const handleDelete = async(id:number)=>{ await deleteCustomer(id); load(); }

  return <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Customers</h1>
    <div className="flex gap-2 mb-6">
      <Input placeholder="New Customer" value={newName} onChange={e=>setNewName(e.target.value)} />
      <Button onClick={handleAdd}>Add</Button>
    </div>
    <div className="space-y-4">
      {customers.map(cus=>(
        <Card key={cus.id}>
          <CardContent className="flex justify-between items-center p-4">
            <span>{cus.name}</span>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={()=>setEditCus({...cus})}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
                  <Input value={editCus?.name || ''} onChange={e=>setEditCus(prev=>prev?{...prev,name:e.target.value}:null)} />
                  <Button className="mt-3" onClick={handleUpdate}>Save</Button>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={()=>handleDelete(cus.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
}
