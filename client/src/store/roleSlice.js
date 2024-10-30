// store/rolesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    userId: null,
    role: null,
    metamaskId: null,
  },
  reducers: {
    setRole: (state, action) => {
      // Ensure action.payload contains serializable data
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.metamaskId = action.payload.metamaskId;
    },
  },
});


export const { setRole } = rolesSlice.actions;
export default rolesSlice.reducer;
