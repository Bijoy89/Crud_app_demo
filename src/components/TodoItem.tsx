"use client";

import Link from "next/link";

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

export default function TodoItem({ id, title, description, isCompleted }: TodoItemProps) {
  return (
    <Link href={`/todos/${id}`}>
      <div className="border p-3 rounded hover:shadow cursor-pointer">
        <h2 className="font-semibold">{title}</h2>
        <p>{description}</p>
        <p>Status: {isCompleted ? "Completed" : "Pending"}</p>
      </div>
    </Link>
  );
}
