import * as React from "react";

function taskId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const num = (Math.random() * 16) | 0;
    const value = char === "x" ? num : (num & 0x3) | 0x8;
    return value.toString(16);
  });
}

const taskReducer: React.Reducer<Task, Action> = (state, { payload, type }) => {
  if (type !== "clearTask" && typeof payload === "undefined") {
    throw Error("payload cannot be empty!");
  }

  switch (type) {
    case "setTitle":
      if (typeof payload !== "string") throw Error("Payload should be a string!");
      return { ...state, title: payload };

    case "setDescription":
      if (typeof payload !== "string") throw Error("Payload should be a string!");
      return { ...state, description: payload };

    case "setCompleted":
      if (typeof payload !== "boolean") throw Error("Payload should be a boolean!");
      return { ...state, completed: payload };

    case "cloneTask":
      return payload;

    case "clearTask":
      return { id: "", title: "", description: "", completed: false };

    default:
      return state;
  }
};

export function TaskForm({ clonedTask, ...props }: FormProps) {
  const [editMode, setEditMode] = React.useState(false);

  const [task, dispatch] = React.useReducer(taskReducer, {
    id: props?.task?.id || "",
    title: props?.task?.title || "",
    completed: props?.task?.completed || false,
    description: props?.task?.description || "",
  });

  React.useEffect(() => {
    if (clonedTask) dispatch({ type: "cloneTask", payload: clonedTask });
  }, [clonedTask]);

  const onToggleEdit = () => setEditMode((s) => !s);
  const onSetTitle = (payload: string) => dispatch({ type: "setTitle", payload });
  const onSetDescription = (payload: string) => dispatch({ type: "setDescription", payload });
  const onSetCompleted = (payload: boolean) => {
    dispatch({ type: "setCompleted", payload });
    props?.onSave?.({ ...task, completed: payload });
  };

  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (props?.task) {
        props?.onSave?.(task);
        onToggleEdit();
      } else {
        props?.onSubmit?.({ ...task, id: taskId() });
        dispatch({ type: "clearTask" });
      }
    },
    [props, task]
  );

  return (
    <form onSubmit={onSubmit}>
      <input
        id="title"
        name="title"
        value={task.title}
        disabled={props?.task && !editMode}
        onChange={(e) => onSetTitle(e.target.value)}
      />

      <textarea
        id="description"
        name="description"
        value={task.description}
        disabled={props?.task && !editMode}
        onChange={(e) => onSetDescription(e.target.value)}
      />

      <button disabled={props?.task && !editMode}>{!props?.task ? "Add" : "Save"}</button>

      {props?.task && (
        <div>
          <button onClick={onToggleEdit} type="button">
            {editMode ? "Cancel" : `Edit`}
          </button>

          <button onClick={() => props?.onClone?.(task)} type="button">
            Clone
          </button>

          <button disabled={editMode} onClick={() => props?.onDelete?.(task.id)} type="button">
            Delete
          </button>
        </div>
      )}

      <div className="task__checkbox">
        <label htmlFor="checkbox">{task.completed ? "done" : "close this task"}</label>
        <input
          id="checkbox"
          type="checkbox"
          name="completed"
          checked={task.completed}
          onChange={(e) => onSetCompleted(e.target.checked)}
        />
      </div>
    </form>
  );
}
