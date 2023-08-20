import * as React from "react";

import { TaskForm } from "./TaskForm";

export function TaskList() {
  const [clonedTask, setClonedTask] = React.useState<Task>();

  const [tasks, setTask] = React.useState(() => {
    const tasksJSON = localStorage.getItem("tasks");
    const tasksList = (tasksJSON ? JSON.parse(tasksJSON) : []) as Task[];
    const tasksIterator = tasksList.map((task) => [task.id, task]) as [string, Task][];
    return new Map(tasksIterator);
  });

  const onLogTask = (task: Task) => {
    setTask((tasks) => {
      const next = new Map(tasks.set(task.id, task));
      localStorage.setItem("tasks", JSON.stringify([...next.values()]));
      return next;
    });
  };

  const onDeleteTask = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this task?`)) {
      setTask((tasks) => {
        tasks.delete(id);
        const next = new Map(tasks);
        localStorage.setItem("tasks", JSON.stringify([...next.values()]));
        return next;
      });
    }
  };

  return (
    <div>
      <TaskForm onSubmit={onLogTask} clonedTask={clonedTask} />

      {Array.from(tasks.values()).map((task) => (
        <li key={task.id}>
          <TaskForm
            task={task}
            onSave={onLogTask}
            onClone={setClonedTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </div>
  );
}
