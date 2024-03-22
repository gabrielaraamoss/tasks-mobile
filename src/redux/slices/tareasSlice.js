import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tareas: [],
};

export const tareaSlice = createSlice({
  name: 'tarea',
  initialState,
  reducers: {
    agregarTarea: (state, action) => {
      state.tareas.push(action.payload);
    },
    eliminarTarea: (state, action) => {
      state.tareas = state.tareas.filter(tarea => tarea.id !== action.payload);
    },
    editarTarea: (state, action) => {
      const index = state.tareas.findIndex(tarea => tarea.id === action.payload.id);
      if (index !== -1) {
        state.tareas[index] = action.payload;
      }
    },
  },
});

export const { agregarTarea, eliminarTarea, editarTarea } = tareaSlice.actions;

export default tareaSlice.reducer;