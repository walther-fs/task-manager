import TaskItem from "./TaskItem";

function TaskList({ tasks, toggleTask, deleteTask, editTask }) {
  if (!tasks.length) {
    return (
      <p className="empty-message" aria-live="polite">
        No hay tareas por ahora.
      </p>
    );
  }

  return (
    <div className="task-list-container">
      <ul className="list-unstyled mb-0" role="list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            {...{ task, toggleTask, deleteTask, editTask }}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
