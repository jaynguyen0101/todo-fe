import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TaskCardProps } from "../../../types";

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  return (
    <li
      className={`flex items-center justify-between p-4 bg-gray-800 border rounded-lg ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Circular Checkbox */}
        <button
          onClick={() => onToggle(task.id, task.completed)}
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
      <button onClick={() => onDelete(task.id)}>
        <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-600" />
      </button>
    </li>
  );
};

export default TaskCard;
