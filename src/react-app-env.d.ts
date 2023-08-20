/// <reference types="react-scripts" />

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

type Action =
  | { type: "setTitle"; payload: string }
  | { type: "setDescription"; payload: string }
  | { type: "setCompleted"; payload: boolean }
  | { type: "cloneTask"; payload: Task }
  | { type: "clearTask"; payload?: undefined };

type FormProps = {
  task?: Task;
  clonedTask?: Task;

  onSave?: (task: Task) => void;
  onClone?: (task: Task) => void;
  onSubmit?: (task: Task) => void;
  onDelete?: (id: string) => void;
};
