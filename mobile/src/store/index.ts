import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { petsReducer } from './slices/petsSlice';
import { translationsReducer } from './slices/translationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petsReducer,
    translations: translationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
