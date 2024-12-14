import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, get } from "firebase/database";

// Create an asynchronous thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  const snapshot = await get(usersRef); // Use `get` to fetch data once

  const usersList = [];

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      console.log(userData); // Debug log
      // Filter out admins and ensure the role is "user"
      if (!userData.isAdmin && userData.role === "user") {
        usersList.push({
          id: childSnapshot.key,
          ...userData,
        });
      }
    });
  }

  return usersList; // Return the collected users list
});

// Create a slice for user management
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true; // Set loading state
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.users = action.payload; // Store fetched users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false; // Reset loading state on error
        state.error = action.error.message; // Set error message
      });
  },
});

// Selector to access users from the state
export const selectUsers = (state) => state.users.users;

export default userSlice.reducer; // Export the reducer
