"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { updateTodo, deleteTodo } from "@/lib/todoApi";
import { useRouter, useParams } from "next/navigation";

export default function TodoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodo() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return alert(error.message);

      setTitle(data.title);
      setDescription(data.description);
      setIsCompleted(data.is_completed);
      setLoading(false);
    }

    fetchTodo();
  }, [id]);

  async function handleUpdate() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Login required");

    const res = await updateTodo(
      id!,
      { title, description, is_completed: isCompleted },
      user.id
    );

    if (res.success) alert("Updated!");
    else alert(res.error || "Error updating");
  }

  async function handleDelete() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Login required");

    const res = await deleteTodo(id!, user.id);

    if (res.success) router.push("/todos");
    else alert(res.error || "Error deleting");
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      ></textarea>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <span>Completed</span>
      </label>
      <div className="space-x-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
