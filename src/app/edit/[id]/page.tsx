"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";
import TaskForm from "@/app/components/TaskForm";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the task ID from the URL
  const queryClient = useQueryClient();

  // Fetch the existing task
  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tasks/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }
      return res.json();
    },
    enabled: !!id,
  });

  // Mutation to update the task
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      color,
    }: {
      id: string;
      title: string;
      color: string;
    }) => {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, color }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh the task list
      alert("Task updated successfully!");
      router.push("/"); // Redirect to Home View
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error fetching task. Please try again.
      </div>
    );
  }

  const handleUpdateTask = (title: string, color: string) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (typeof id === "string") {
      updateTaskMutation.mutate({
        id,
        title: title.trim(),
        color: color,
      });
    } else {
      alert("Invalid task ID");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center">
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

      {/* Form */}
      <TaskForm
        initialTitle={task?.title}
        initialColor={task?.color}
        isEditing={true}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
}
