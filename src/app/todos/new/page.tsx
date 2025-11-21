"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createTodo } from "@/lib/todoApi";
import { useRouter } from "next/navigation";

export default function NewTodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("You must be logged in.");

    const res = await createTodo(title, description, user.id);

    if (res.success) {
      router.push("/todos");
    } else {
      alert(res.error || "Error creating todo");
    }

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Todo</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Todo"}
        </button>
      </form>
    </div>
  );
}
