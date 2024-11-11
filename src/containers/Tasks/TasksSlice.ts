import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const { data } = await axiosApi.get<{ [key: string]: Task } | null>(
    "tasks.json",
  );
  return data
    ? Object.keys(data).map((key) => ({ ...data[key], id: key }))
    : [];
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (newTask: Omit<Task, "id">) => {
    const response = await axiosApi.post("tasks.json", newTask);
    return { ...newTask, id: response.data.name };
  },
);

export const toggleTask = createAsyncThunk(
  "tasks/toggleTask",
  async (taskId: string) => {
    const response = await axiosApi.get(`tasks/${taskId}.json`);
    return {
      ...response.data,
      id: taskId,
      completed: !response.data.completed,
    };
  },
);

export const changeTasksValue = createAsyncThunk(
  "tasks/changeTasksValue",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { tasks: TasksState };
    const tasks = state.tasks.tasks;

    await axiosApi.put(
      "tasks.json",
      tasks.reduce(
        (acc, task) => {
          acc[task.id] = { title: task.title, completed: task.completed };
          return acc;
        },
        {} as Record<string, Omit<Task, "id">>,
      ),
    );
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await axiosApi.delete(`tasks/${taskId}.json`);
    return taskId;
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(changeTasksValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeTasksValue.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeTasksValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update tasks";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const tasksReducer = tasksSlice.reducer;
export const {} = tasksSlice.actions;
