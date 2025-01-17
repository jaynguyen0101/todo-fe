export interface Task {
  id: number;
  title: string;
  color: string;
  completed: boolean;
}

export interface TaskCardProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}
