import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice'; 
import jobReducer from './auth/jobSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer, // Reducer para la autenticación
    jobs: jobReducer,  // Reducer para los trabajos
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desactiva la verificación de serialización si es necesario
    }),
});

// Tipos para el estado global y el dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;