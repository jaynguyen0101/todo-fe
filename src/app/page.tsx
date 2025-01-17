"use client";

import { API_URL } from "@/config/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Task {
  id: number;
  title: string;
  color: string;
  completed: boolean;
}

// Fetch tasks using React Query
async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

// Toggle task completion
async function toggleTaskCompletion({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: !completed }),
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  return res.json();
}

export default function HomePage() {
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Toggle task mutation
  const toggleTaskMutation = useMutation({
    mutationFn: toggleTaskCompletion, // Use object syntax for mutation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh tasks
    },
    onError: (error) => {
      console.error("Error toggling task:", error);
      alert("Failed to update task. Please try again.");
    },
  });

  const total = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error fetching tasks. Please check the console.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center bg-background">
      {/* Header */}
      <header className="w-full  bg-black  text-center h-52 flex flex-col items-center justify-center z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <span role="img" aria-label="rocket">
              🚀
            </span>
            <span className="text-primary">Todo</span>{" "}
            <span className="text-accent">App</span>
          </h1>
        </div>
      </header>
      <section
        className="bg-background w-full mx-auto flex items-center justify-center flex-col"
        style={{ marginTop: "-26px" }}
      >
        {/* Create Task Button */}
        <div className="max-w-3xl w-full z-20">
          <Link href="/create">
            <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
              <span>Create Task</span>
              <PlusCircleIcon className="h-6 w-6" />
            </button>
          </Link>
        </div>

        {/* Task Counts */}
        <div className="mt-20 w-full max-w-3xl flex justify-between items-center text-gray-400 font-medium">
          <span className="inline-flex">
            <span className="text-primary">Tasks</span>
            <div className="h-5 w-5 flex items-center justify-center bg-gray-700 text-white rounded-full text-sm ml-3 mt-0.5 pt-0.5">
              {total}
            </div>
          </span>
          <span className="inline-flex">
            <span className="text-accent">Completed</span>:{" "}
            <div className="h-6 w-16 flex items-center justify-center bg-gray-700 text-white rounded-full text-sm ml-3 pt-1">
              {completedCount} de {total}
            </div>
          </span>
        </div>

        {/* Task List or Empty State */}
        {tasks.length > 0 ? (
          <ul className="mt-8 w-full max-w-3xl space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-4 bg-gray-800 border rounded-lg ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Circular Checkbox */}
                  <button
                    onClick={() =>
                      toggleTaskMutation.mutate({
                        id: task.id,
                        completed: task.completed,
                      })
                    }
                    className={`h-6 w-6 flex items-center justify-center rounded-full border-2 ${
                      task.completed
                        ? "bg-purple-500 border-purple-500"
                        : "bg-transparent border-primary"
                    } transition-colors duration-200`}
                  >
                    {task.completed && (
                      <span className="text-white font-bold text-xs">✓</span>
                    )}
                  </button>
                  <Link href={`/edit/${task.id}`}>
                    <span
                      className={`text-sm ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </Link>
                </div>
                <button onClick={() => handleDelete(task.id)}>
                  <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow mt-16">
            <div className="text-gray-500 flex flex-col items-center">
              <span className="text-5xl">📝</span>
              <p className="mt-4 text-xl font-semibold">
                You don&apos;t have any tasks registered yet.
              </p>
              <p className="mt-2 text-gray-400">
                Create tasks and organize your to-do items.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  // Delete a task
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      location.reload(); // Quick refresh; better to use mutation + invalidateQueries
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}
