import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

const useProductStore = create((set) => ({
  products: [],
  fetchProducts: async () => {
    const res = await axios.get(API_URL);
    set({ products: res.data });
  },
  addProduct: async (product) => {
    const res = await axios.post(API_URL, product);
    set((state) => ({ products: [...state.products, res.data] }));
  },
  updateProduct: async (updatedProduct) => {
    const res = await axios.put(`${API_URL}/${updatedProduct.id}`, updatedProduct);
    set((state) => ({
      products: state.products.map((p) => (p.id === updatedProduct.id ? res.data : p)),
    }));
  },
  removeProduct: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },
}));

export default useProductStore;
