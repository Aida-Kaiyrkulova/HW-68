import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../api/store";
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
  changeTasksValue,
} from "./TasksSlice";

const Tasks = () => {
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      dispatch(addTask({ title: newTaskTitle, completed: false }));
      setNewTaskTitle("");
      dispatch(changeTasksValue());
    }
  };

  const handleToggleTask = (task: { id: string; completed: boolean }) => {
    dispatch(toggleTask(task.id));
    dispatch(changeTasksValue());
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    dispatch(changeTasksValue());
  };

  return (
    <div className="App">
      <h1>To Do List</h1>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task"
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task)}
            />
            {task.title}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
