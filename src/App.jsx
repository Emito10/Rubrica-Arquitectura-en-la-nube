import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [productos, setProductos] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    stock: '',
    id_categoria: '',
    id_proveedor: ''
  });

  const [editando, setEditando] = useState(false);

  const [idProducto, setIdProducto] = useState(null);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productos');
      setProductos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {

  const cargarProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productos');
      setProductos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  cargarProductos();

}, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    try {

      if (editando) {

        await axios.put(
          `http://localhost:3000/productos/${idProducto}`,
          formulario
        );

        setEditando(false);
        setIdProducto(null);

      } else {

        await axios.post(
          'http://localhost:3000/productos',
          formulario
        );
      }

      setFormulario({
        nombre: '',
        precio: '',
        stock: '',
        id_categoria: '',
        id_proveedor: ''
      });

      obtenerProductos();

    } catch (error) {
      console.log(error);
    }
  };

  const editarProducto = (producto) => {

    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
      id_proveedor: producto.id_proveedor
    });

    setEditando(true);

    setIdProducto(producto.id_producto);
  };

  const eliminarProducto = async (id) => {

    try {

      await axios.delete(
        `http://localhost:3000/productos/${id}`
      );

      obtenerProductos();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">

      <h1>Sistema de Gestión de Productos</h1>

      <form onSubmit={guardarProducto}>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formulario.precio}
          onChange={manejarCambio}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formulario.stock}
          onChange={manejarCambio}
          required
        />

        <select
          name="id_categoria"
          value={formulario.id_categoria}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione categoría</option>
          <option value="1">Tecnología</option>
          <option value="2">Papelería</option>
          <option value="3">Accesorios</option>
        </select>

        <select
          name="id_proveedor"
          value={formulario.id_proveedor}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione proveedor</option>
          <option value="1">TecnoWorld</option>
          <option value="2">OfficePlus</option>
          <option value="3">Accesorios JA</option>
        </select>

        <button type="submit">
          {editando ? 'Actualizar' : 'Guardar'}
        </button>

      </form>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {productos.map((producto) => (

            <tr key={producto.id_producto}>

              <td>{producto.id_producto}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.categoria}</td>
              <td>{producto.proveedor}</td>

              <td>

                <button
                  onClick={() => editarProducto(producto)}
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarProducto(producto.id_producto)}
                >
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;