import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/Product';

export const fetchVegetables = createAsyncThunk(
  'vegetables/fetchVegetables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json'
      );
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки товаров');
      }
      
      const data: Product[] = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      return rejectWithValue(message);
    }
  }
);

interface VegetableState {
  products: Product[];
  loading: boolean;
  error: string | null;
  quantities: Record<number, number>;
  cart: Record<number, number>;
}

const initialState: VegetableState = {
  products: [],
  loading: false,
  error: null,
  quantities: {},
  cart: {},
};

const vegetableSlice = createSlice({
  name: 'vegetables',
  initialState,
  reducers: {
    updateQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
      const { id, delta } = action.payload;
      const current = state.quantities[id] || 0;
      const newValue = Math.max(0, current + delta);
      state.quantities[id] = newValue;
    },
    addToCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const quantity = state.quantities[id] || 0;
      if (quantity > 0) {
        state.cart[id] = (state.cart[id] || 0) + quantity;
        state.quantities[id] = 0;
      }
    },
    clearCart: (state) => {
      state.cart = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVegetables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVegetables.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchVegetables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateQuantity, addToCart, clearCart } = vegetableSlice.actions;
export default vegetableSlice.reducer;