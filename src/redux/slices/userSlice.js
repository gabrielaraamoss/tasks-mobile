import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checked: false,
  loggedIn: false,
  userId: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticate: (state, { payload }) => {
      state.loggedIn = payload.loggedIn;
      state.checked = payload.checked;
      state.userId = payload.userId; 
    },
  },
});

export const userReducer = userSlice.reducer;
export const { authenticate } = userSlice.actions;
export default userSlice.reducer;