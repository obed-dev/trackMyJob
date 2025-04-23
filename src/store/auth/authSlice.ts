import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  status: 'checking' | 'authenticated' | 'not authenticated';
  user: User | null;
  errorMessage: string | undefined;
}

const initialState: AuthState = {
  status: 'checking', // 'checking', 'authenticated', 'not authenticated'
  user: null,
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = 'checking';
      state.user = null;
      state.errorMessage = undefined;
    },
    login: (state, action: PayloadAction<User>) => {
      state.status = 'authenticated';
      state.user = action.payload; // Asegúrate de que el payload contenga { id, name, email }
      state.errorMessage = undefined;
    },
    logout: (state, action: PayloadAction<string | undefined>) => {
      state.status = 'not authenticated';
      state.user = null;
      state.errorMessage = action.payload || undefined;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onChecking, login, logout, clearErrorMessage } = authSlice.actions;
export default authSlice.reducer;