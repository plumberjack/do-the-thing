import { renderHook, act } from "@testing-library/react-hooks";
import { useTaskList } from "../TaskList";

describe("useTaskList", () => {
  beforeEach(() => {
    localStorage.clear();
    window.confirm = jest.fn(() => true);
  });

  test("should initialize tasks state from localStorage", () => {
    const tasks = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ];
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const { result } = renderHook(() => useTaskList());

    expect(result.current.tasks.size).toBe(2);
    expect(result.current.tasks.get("1")).toEqual(tasks[0]);
    expect(result.current.tasks.get("2")).toEqual(tasks[1]);
  });

  test("should add a new task and save to localStorage", () => {
    const { result } = renderHook(() => useTaskList());

    act(() => {
      result.current.addTask({ id: "1", title: "Task 1" } as Task);
    });

    expect(result.current.tasks.size).toBe(1);
    expect(result.current.tasks.get("1")).toEqual({ id: "1", title: "Task 1" });
    expect(localStorage.getItem("tasks")).toBe(JSON.stringify([{ id: "1", title: "Task 1" }]));
  });

  test("should delete a task and save to localStorage", () => {
    const tasks = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ];
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const { result } = renderHook(() => useTaskList());

    act(() => {
      result.current.deleteTask("1");
    });

    expect(result.current.tasks.size).toBe(1);
    expect(result.current.tasks.get("1")).toBeUndefined();
    expect(result.current.tasks.get("2")).toEqual(tasks[1]);
    expect(localStorage.getItem("tasks")).toBe(JSON.stringify([{ id: "2", title: "Task 2" }]));
  });
});
