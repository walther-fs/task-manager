import { useState } from "react";
import toast from "react-hot-toast";

function TaskItem({ task, toggleTask, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  const [newPriority, setNewPriority] = useState(task.priority);

  const handleSave = () => {
    const text = newText.trim();
    if (!text) return toast.error("El texto no puede estar vacío.");

    editTask(task.id, text, newPriority);
    setIsEditing(false);
    toast.success("Tarea actualizada");
  };

  return (
    <li
      role="listitem"
      className={`task-item ${task.completed ? "completed" : ""} priority-${
        task.priority
      }`}
    >
      {isEditing ? (
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            value={newText}
            autoFocus
            aria-label="Editar texto de tarea"
            aria-required="true"
            aria-invalid={!newText.trim()}
            onChange={(e) => {
              setNewText(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="task-edit-input"
          />
          <select
            className="form-select form-select-sm task-priority-select"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            aria-label="Cambiar prioridad de tarea"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          <button
            onClick={handleSave}
            className="btn btn-sm"
            aria-label="Guardar cambios"
          >
            <i className="bi bi-floppy2-fill text-primary"></i>
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-sm"
            aria-label="Cancelar cambios"
          >
            <i className="bi bi-x-lg text-danger"></i>
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center w-100">
          <label className="d-flex align-items-center gap-2 flex-grow-1">
            <span className="task-text">{task.text}</span>
            <small>({task.priority})</small>
          </label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              aria-label="Tarea completada"
              className="form-check-input"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-sm"
              aria-label="Editar tarea"
            >
              <i className="bi bi-pencil-fill text-primary"></i>
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="btn btn-sm"
              aria-label="Eliminar tarea"
            >
              <i className="bi bi-trash3-fill text-danger"></i>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default TaskItem;
