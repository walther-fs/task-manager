import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "../components/TaskForm";

describe("TaskForm", () => {
  it("muestra error si el input está vacío", () => {
    const mockAddTask = vi.fn();
    render(<TaskForm addTask={mockAddTask} />);

    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it("muestra error si no selecciona prioridad", () => {
    const mockAddTask = vi.fn();
    render(<TaskForm addTask={mockAddTask} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Tarea sin prioridad" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it("agrega tarea válida y limpia el formulario", () => {
    const mockAddTask = vi.fn();
    render(<TaskForm addTask={mockAddTask} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Nueva tarea" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "alta" },
    });
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));

    expect(mockAddTask).toHaveBeenCalledWith("Nueva tarea", "alta");
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});
