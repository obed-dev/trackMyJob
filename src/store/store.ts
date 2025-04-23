import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import jobReducer from './auth/jobSlice';
// Importa el tipo JobState

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;