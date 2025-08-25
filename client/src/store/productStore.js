import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://192.168.0.108:5000/api/products';

const useProductStore = create((set) => ({
  products: [],
  fetchProducts: async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(API_URL, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    set({ products: res.data });
  },
  addProduct: async (product) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(API_URL, product, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    set((state) => ({ products: [...state.products, res.data] }));
  },
  updateProduct: async (updatedProduct) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API_URL}/${updatedProduct.id}`, updatedProduct, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    set((state) => ({
      products: state.products.map((p) => (p.id === updatedProduct.id ? res.data : p)),
    }));
  },
  removeProduct: async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },
  searchProducts: async (query) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/search`, {
      params: { query },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    set({ products: res.data });
  },
}));

export default useProductStore;
