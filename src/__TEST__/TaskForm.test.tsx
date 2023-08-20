import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskForm } from "../TaskForm";

describe("TaskForm", () => {
  it("renders form for adding new task when no task prop is passed", () => {
    render(<TaskForm />);

    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("renders form for editing existing task when task prop is passed", () => {
    const task = {
      id: "1",
      title: "Test Task",
      description: "Test Task Description",
      completed: false,
    };

    render(<TaskForm task={task} />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("allows editing task fields when in edit mode", () => {
    const task = {
      id: "1",
      title: "Test Task",
      description: "Test Task Description",
      completed: false,
    };

    render(<TaskForm task={task} />);

    // Click edit button
    userEvent.click(screen.getByText("Edit"));

    // Fields should be editable now
    expect(screen.getByDisplayValue("Test Task")).toBeEnabled();
  });
});
