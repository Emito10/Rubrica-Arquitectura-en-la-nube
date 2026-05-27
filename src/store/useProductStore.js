import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/products";

const useProductStore = create((set, get) => ({
  productos: [],
  loading: false,
  error: null,

  obtenerProductos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ productos: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
    }
  },

  guardarProducto: async (formulario, editando, idProducto) => {
    set({ loading: true });
    try {
      if (editando) {
        await axios.put(`${API_URL}/${idProducto}`, formulario);
      } else {
        await axios.post(API_URL, formulario);
      }
      await get().obtenerProductos();
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
      return false;
    }
  },

  eliminarProducto: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${id}`);
      await get().obtenerProductos();
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
    }
  },
}));

export default useProductStore;
