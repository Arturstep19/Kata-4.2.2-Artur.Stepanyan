import { configureStore } from '@reduxjs/toolkit';
import vegetableReducer from './slices/vegetableSlice';

export const store = configureStore({
  reducer: {
    vegetables: vegetableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;