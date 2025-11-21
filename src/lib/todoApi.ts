// src/lib/todoApi.ts

export async function createTodo(title: string, description: string, user_id: string) {
  const res = await fetch("/api/todos/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, user_id })
  });

  return res.json();
}

export async function updateTodo(id: string, newData: any, user_id: string) {
  const res = await fetch("/api/todos/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, newData, user_id })
  });

  return res.json();
}

export async function deleteTodo(id: string, user_id: string) {
  const res = await fetch("/api/todos/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, user_id })
  });

  return res.json();
}
