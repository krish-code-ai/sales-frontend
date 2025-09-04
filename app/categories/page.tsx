"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/server/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

type Category = { id: number; name: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleCreate() {
    if (!newCategory) return;
    await createCategory({ name: newCategory });
    setNewCategory("");
    await loadCategories();
  }

  async function handleUpdate() {
    if (!editing) return;
    await updateCategory(editing.id, { name: editing.name });
    setEditing(null);
    await loadCategories();
  }

  async function handleDelete(id: number) {
    await deleteCategory(id);
    await loadCategories();
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item Categories</h1>

      {/* Add New */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={handleCreate}>Add</Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex justify-between items-center p-4">
              <span>{cat.name}</span>
              <div className="flex gap-2">
                {/* Edit Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditing({ ...cat })}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={editing?.name || ""}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                    <Button className="mt-3" onClick={handleUpdate}>
                      Save
                    </Button>
                  </DialogContent>
                </Dialog>

                {/* Delete */}
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
