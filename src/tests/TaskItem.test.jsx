import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../components/TaskItem";

describe("TaskItem", () => {
  const task = {
    id: 1,
    text: "Tarea de prueba",
    priority: "alta",
    completed: false,
  };

  it("marca como completada al hacer click en checkbox", () => {
    const toggleTask = vi.fn();
    render(
      <TaskItem
        task={task}
        toggleTask={toggleTask}
        deleteTask={() => {}}
        editTask={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(toggleTask).toHaveBeenCalledWith(task.id);
  });

  it("activa modo edición y guarda cambios", () => {
    const editTask = vi.fn();
    render(
      <TaskItem
        task={task}
        toggleTask={() => {}}
        deleteTask={() => {}}
        editTask={editTask}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /editar tarea/i }));

    const input = screen.getByRole("textbox", { name: /editar texto/i });
    fireEvent.change(input, { target: { value: "Texto editado" } });

    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(editTask).toHaveBeenCalledWith(task.id, "Texto editado", "alta");
  });

  it("elimina tarea al hacer click en borrar", () => {
    const deleteTask = vi.fn();
    render(
      <TaskItem
        task={task}
        toggleTask={() => {}}
        deleteTask={deleteTask}
        editTask={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /eliminar tarea/i }));

    expect(deleteTask).toHaveBeenCalledWith(task.id);
  });
});
