import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import ReactSwitch from "react-switch";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const FILTERS = [
  { key: "all", label: "Todas", active: "btn-primary", inactive: "btn-secondary" },
  { key: "completed", label: "Completadas", active: "btn-success", inactive: "btn-secondary" },
  { key: "pending", label: "Pendientes", active: "btn-pending", inactive: "btn-secondary" },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null
      ? saved === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // LocalStorage (cargar + guardar)
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Agregar tarea
  const addTask = useCallback((taskText, priority) => {
    setTasks(prev => [
      {
        id: Date.now(),
        text: taskText.trim(),
        completed: false,
        priority,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  // Editar tarea
  const editTask = useCallback((id, newText, newPriority) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text: newText.trim(), priority: newPriority } : task
      )
    );
  }, []);

  // Marcar tarea
  const toggleTask = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updatedCompleted = !task.completed;
    if (updatedCompleted) {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 500)),
        {
          loading: "Actualizando tarea...",
          success: "Tarea completada",
          error: "Ocurrió un error al actualizar la tarea",
        }
      );
    } else {
      toast((t) => (
        <div className="d-flex justify-content-between align-items-center">
          <span>
            Tarea marcada como <b>pendiente</b>.
          </span>
          <div className="toast-undo-container">
            <button
              className="toast-undo-btn"
              onClick={() => {
                setTasks((prev) =>
                  prev.map((task) =>
                    task.id === id ? { ...task, completed: true } : task
                  )
                );
                toast.dismiss(t.id);
              }}>
            Deshacer
            </button>
          </div>
        </div>
      ));
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: updatedCompleted } : t))
    );
  }, [tasks]);

  // Eliminar tarea
  const requestDeleteTask = (id) => setTaskToDelete(id);

  const confirmDeleteTask = () => {
    setTasks(prev => prev.filter(task => task.id !== taskToDelete));
    toast.success("Tarea eliminada");
    closeModal();
  };
  const closeModal = () => setTaskToDelete(null);

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
      filter === "completed" ? task.completed :
      filter === "pending" ? !task.completed :
      true;

    const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesStatus && matchesSearch && matchesPriority;
  });

  return (
    <div className="container py-4">      
      <header className="d-flex justify-content-end align-items-center gap-2 mb-2">
        <span id="mode-label" className="mode-label">
          {darkMode ? "Modo oscuro" : "Modo claro"}
        </span>
        <ReactSwitch
          checked={darkMode}
          onChange={setDarkMode}
          height={20}
          width={38}
          handleDiameter={18}
          offColor="#9CA3AF"
          onColor="#3A4A68"
          uncheckedIcon={false}
          checkedIcon={false}
          aria-labelledby="mode-label"
        />
      </header>      
      <main>
        <h1 className="mb-4 text-center app-title">Gestor de Tareas</h1>
        <section className="row">
          <div className="col-md-6 mx-auto">
            <div className="card p-3 shadow-sm mb-4">
              <div
                className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-4 filtros"
                role="group"
                aria-label="Filtros de tareas"
              >
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    className={`btn btn-sm rounded-pill ${filter === f.key ? f.active : f.inactive}`}
                    onClick={() => setFilter(f.key)}
                    aria-pressed={filter === f.key}
                  >
                  {f.label}
                  </button>
                ))}
                <label htmlFor="priorityFilter" className="visually-hidden">
                Filtrar por prioridad
                </label>
                <select
                  id="priorityFilter"
                  className="form-select form-select-sm w-auto"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  aria-label="Filtrar por prioridad"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <label htmlFor="search" className="visually-hidden">Buscar tareas</label>
              <input
                id="search"
                type="text"
                className="form-control form-control-sm border rounded"
                placeholder="Buscar tareas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar tareas"
              />
            </div>
            <div className="mb-4">
              <TaskForm addTask={addTask} />
            </div>
          </div>
        </section>
        <TaskList
          tasks={filteredTasks}
          toggleTask={toggleTask}
          deleteTask={requestDeleteTask}
          editTask={editTask}
        />
      </main>
      {taskToDelete && (
        <>
          <div className="modal fade show d-block" role="alertdialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content ${darkMode ? "modal-dark" : ""}`}>
                <div className="modal-header">
                  <h5 id="modalTitle" className="modal-title">Confirmar eliminación</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <p id="modalDesc">¿Estás seguro de que quieres eliminar esta tarea?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
                  Cancelar
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={confirmDeleteTask}>
                  Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? 'var(--dark-card)' : 'var(--light-card)',
            color:      darkMode ? 'var(--dark-text)' : 'var(--light-text)',
            border:     darkMode ? '1px solid var(--dark-border)' : '1px solid var(--light-border)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
            borderRadius: '10px'
          },
          success: {
            iconTheme: {
              secondary: darkMode ? 'var(--dark-card)' : 'var(--light-card)',
            },
          },
          error: {
            iconTheme: {
              secondary: darkMode ? 'var(--dark-card)' : 'var(--light-card)',
            },
          },
        }}
      />

    </div>
  );
}

export default App;