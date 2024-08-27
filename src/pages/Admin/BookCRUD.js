import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';


const BookCRUD = () => {
  const [form, setForm] = useState({
    id: null,
    titulo: '',
    description: '',
    image_url: '',
    autor_ids: [],
    editorial_id: '',
    disponibilidad: '',
    genero_ids: [],
  });
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [newAuthor, setNewAuthor] = useState('');
  const [newEditorial, setNewEditorial] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksCollection = collection(db, 'libros');
        const categoriesCollection = collection(db, 'generos');
        const authorsCollection = collection(db, 'autores');
        const editorialsCollection = collection(db, 'editoriales');

        const booksSnapshot = await getDocs(booksCollection);
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const authorsSnapshot = await getDocs(authorsCollection);
        const editorialsSnapshot = await getDocs(editorialsCollection);

        const booksData = booksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const authorsData = authorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const editorialsData = editorialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
        setCategories(categoriesData);
        setAuthors(authorsData);
        setEditorials(editorialsData);

        // Verificar si el usuario está autorizado
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, 'usuarios', user.uid);
          const userSnapshot = await getDocs(userDoc);
          if (userSnapshot.exists()) {
            const roleId = userSnapshot.data().rol_id;
            if (roleId !== 4) {
              navigate('/'); // Redirige a la página principal si no es administrador
            } else {
              setIsAuthorized(true);
            }
          }
        } else {
          navigate('/login'); // Redirige a la página de inicio de sesión si no está autenticado
        }
      } catch (error) {
        console.error('Error al cargar datos:', error.message);
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'autor_ids' || name === 'genero_ids') {
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
      setForm({
        ...form,
        [name]: selectedValues,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        titulo: form.titulo,
        description: form.description,
        image_url: form.image_url,
        autor_ids: form.autor_ids,
        editorial_id: form.editorial_id,
        disponibilidad: form.disponibilidad,
        genero_ids: form.genero_ids,
      };

      if (isEditing) {
        const bookRef = doc(db, 'libros', form.id);
        await updateDoc(bookRef, dataToSubmit);

        setBooks(prevBooks =>
          prevBooks.map(book => (book.id === form.id ? { ...dataToSubmit, id: form.id } : book))
        );
      } else {
        const booksCollection = collection(db, 'libros');
        const newBookRef = await addDoc(booksCollection, dataToSubmit);
        setBooks(prevBooks => [...prevBooks, { ...dataToSubmit, id: newBookRef.id }]);
      }

      setForm({
        id: null,
        titulo: '',
        description: '',
        image_url: '',
        autor_ids: [],
        editorial_id: '',
        disponibilidad: '',
        genero_ids: [],
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error al procesar el libro:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    try {
      const authorsCollection = collection(db, 'autores');
      await addDoc(authorsCollection, { nombre: newAuthor });
      setNewAuthor('');
      // Refrescar la lista de autores
      const authorsSnapshot = await getDocs(authorsCollection);
      const authorsData = authorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error al agregar autor:', error.message);
    }
  };

  const handleAddEditorial = async (e) => {
    e.preventDefault();
    try {
      const editorialsCollection = collection(db, 'editoriales');
      await addDoc(editorialsCollection, { nombre: newEditorial });
      setNewEditorial('');
      // Refrescar la lista de editoriales
      const editorialsSnapshot = await getDocs(editorialsCollection);
      const editorialsData = editorialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEditorials(editorialsData);
    } catch (error) {
      console.error('Error al agregar editorial:', error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const categoriesCollection = collection(db, 'generos');
      await addDoc(categoriesCollection, { nombre: newCategory });
      setNewCategory('');
      // Refrescar la lista de géneros
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al agregar género:', error.message);
    }
  };

  if (!isAuthorized) return null; // Evita renderizar la página si no está autorizado

  return (
    <div className="p-6 max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Actualizar Libro" : "Crear Libro"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titulo"
          value={form.titulo}
          onChange={handleInputChange}
          placeholder="Título"
          className="p-2 border rounded w-full text-gray-700"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Descripción"
          className="p-2 border rounded w-full text-gray-700"
          required
        />
        <input
          type="text"
          name="image_url"
          value={form.image_url}
          onChange={handleInputChange}
          placeholder="URL de la imagen"
          className="p-2 border rounded w-full text-gray-700"
        />
        <select
          name="autor_ids"
          multiple
          value={form.autor_ids}
          onChange={handleInputChange}
          className="p-2 border rounded w-full text-gray-700"
          required
        >
          <option value="">Selecciona autores</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.nombre}
            </option>
          ))}
        </select>
        <select
          name="editorial_id"
          value={form.editorial_id}
          onChange={handleInputChange}
          className="p-2 border rounded w-full text-gray-700"
          required
        >
                    <option value="">Selecciona editorial</option>
          {editorials.map(editorial => (
            <option key={editorial.id} value={editorial.id}>
              {editorial.nombre}
            </option>
          ))}
        </select>
        <select
          name="genero_ids"
          multiple
          value={form.genero_ids}
          onChange={handleInputChange}
          className="p-2 border rounded w-full text-gray-700"
          required
        >
          <option value="">Selecciona géneros</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="disponibilidad"
          value={form.disponibilidad}
          onChange={handleInputChange}
          placeholder="Disponibilidad"
          className="p-2 border rounded w-full text-gray-700"
        />
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => setForm({
              id: null,
              titulo: '',
              description: '',
              image_url: '',
              autor_ids: [],
              editorial_id: '',
              disponibilidad: '',
              genero_ids: [],
            })}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Formularios para agregar nuevas categorías, autores y editoriales */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo</h2>
        <form onSubmit={handleAddAuthor} className="space-y-4">
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Nuevo autor"
            className="p-2 border rounded w-full text-gray-700"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Agregar Autor
          </button>
        </form>
        <form onSubmit={handleAddEditorial} className="space-y-4 mt-4">
          <input
            type="text"
            value={newEditorial}
            onChange={(e) => setNewEditorial(e.target.value)}
            placeholder="Nueva editorial"
            className="p-2 border rounded w-full text-gray-700"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Agregar Editorial
          </button>
        </form>
        <form onSubmit={handleAddCategory} className="space-y-4 mt-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nuevo género"
            className="p-2 border rounded w-full text-gray-700"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Agregar Género
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookCRUD;

