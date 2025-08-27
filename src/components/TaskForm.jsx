import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

function TaskForm({ addTask }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) return toast.error("Debes escribir una tarea.");
    if (!priority) return toast.error("Debes seleccionar una prioridad.");

    addTask(trimmed, priority);
    toast.success("Tarea agregada con éxito");
    setText("");
    setPriority("");
    inputRef.current?.focus();
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  return (
      <form onSubmit={handleSubmit} className="d-flex gap-2" role="form" aria-label="Formulario para agregar tarea">
        <input
          ref={inputRef}
          type="text"
          className="form-control form-control-sm flex-grow-1 border-primary"
          placeholder="Escribe una nueva tarea..."
          aria-label="Campo para escribir tarea"
          aria-required="true"
          aria-invalid={!text.trim()}
          autoComplete="off"
          value={text}
          onChange={handleChange(setText)}
        />

        <select
          className="form-select form-select-sm task-priority-select"
          aria-label="Seleccionar prioridad de la tarea"
          aria-required="true"
          aria-invalid={!priority}
          value={priority}
          onChange={handleChange(setPriority)}
        >
          <option value="" disabled>Prioridad</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        <button type="submit" className="btn btn-primary btn-sm">
          Agregar
        </button>
      </form>
  );
}

export default TaskForm;