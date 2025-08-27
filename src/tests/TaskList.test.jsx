import { render, screen } from "@testing-library/react";
import TaskList from "../components/TaskList";

describe("TaskList", () => {
  it("muestra mensaje si no hay tareas", () => {
    render(<TaskList tasks={[]} toggleTask={() => {}} deleteTask={() => {}} editTask={() => {}} />);
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it("renderiza lista de tareas", () => {
    const tasks = [
      { id: 1, text: "Tarea 1", priority: "alta", completed: false },
      { id: 2, text: "Tarea 2", priority: "baja", completed: true },
    ];

    render(<TaskList tasks={tasks} toggleTask={() => {}} deleteTask={() => {}} editTask={() => {}} />);

    expect(screen.getByText(/tarea 1/i)).toBeInTheDocument();
    expect(screen.getByText(/tarea 2/i)).toBeInTheDocument();
  });
});
