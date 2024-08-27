import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [authorsMap, setAuthorsMap] = useState(new Map());
  const [publishersMap, setPublishersMap] = useState(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const userDoc = doc(db, 'usuarios', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserRole(userSnapshot.data().rol_id);
          } else {
            console.error('El documento del usuario no existe');
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error.message);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }, error => {
      console.error('Error al verificar el estado de autenticación:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      let bookQuery = query(collection(db, 'libros'));
      
      if (selectedCategory) {
        bookQuery = query(bookQuery, where('categoria_id', '==', selectedCategory));
      }

      try {
        const snapshot = await getDocs(bookQuery);
        if (snapshot.empty) {
          setBooks([]);
          return;
        }
        const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
        fetchAdditionalData(booksData);
      } catch (error) {
        console.error('Error al cargar libros:', error.message);
        setError('Hubo un problema al cargar los libros. Inténtalo de nuevo más tarde.');
      }
    };
    
    fetchBooks();
  }, [selectedCategory]);

  const fetchAdditionalData = async (booksData) => {
    const authorIds = [...new Set(booksData.flatMap(book => book.autor_ids || []))];
    const publisherIds = [...new Set(booksData.flatMap(book => book.editorial_ids || []))];
    
    try {
      const authorsPromises = authorIds.map(id => getDoc(doc(db, 'autores', id)));
      const publishersPromises = publisherIds.map(id => getDoc(doc(db, 'editoriales', id)));

      const authorsSnapshot = await Promise.all(authorsPromises);
      const publishersSnapshot = await Promise.all(publishersPromises);
      
      const authors = new Map();
      authorsSnapshot.forEach(doc => {
        if (doc.exists()) {
          authors.set(doc.id, doc.data().nombre);
        }
      });

      const publishers = new Map();
      publishersSnapshot.forEach(doc => {
        if (doc.exists()) {
          publishers.set(doc.id, doc.data().nombre);
        }
      });

      setAuthorsMap(authors);
      setPublishersMap(publishers);
      
    } catch (error) {
      console.error('Error al cargar autores y editoriales:', error.message);
      setError('Hubo un problema al cargar autores y editoriales. Inténtalo de nuevo más tarde.');
    }
  };

  const handleSearch = async () => {
    let bookQuery = query(collection(db, 'libros'));

    if (selectedCategory) {
      bookQuery = query(bookQuery, where('categoria_id', '==', selectedCategory));
    }

    if (searchTerm) {
      bookQuery = query(bookQuery, where('titulo', '>=', searchTerm), where('titulo', '<=', searchTerm + '\uf8ff'));
    }

    try {
      const snapshot = await getDocs(bookQuery);
      if (snapshot.empty) {
        setBooks([]);
        setError('No se encontraron libros con el término de búsqueda proporcionado.');
        return;
      }
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
      fetchAdditionalData(booksData);
      setError(null); // Limpiar errores
    } catch (error) {
      console.error('Error al buscar libros:', error.message);
      setError('Hubo un problema al buscar los libros. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div className="max-w-screen-xl min-h-screen mx-auto p-6 shadow-2xl rounded-lg">
        <main className="mt-6">
          <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
          <div className="flex justify-between items-center mb-6">
            {userRole === '4' && (
              <button
                onClick={() => navigate('/admin/books')}
                type="button"
                className="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-600 hover:bg-gray-200 hover:text-yellow-400 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-yellow-400 dark:hover:bg-gray-700"
              >
                Ir a CRUD de Libros
              </button>
            )}
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre..."
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSearch}
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-600 hover:bg-gray-200 hover:text-yellow-400 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-yellow-400 dark:hover:bg-gray-700"
              >
                Buscar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {error && <p className="text-red-500">{error}</p>}
            {books.length === 0 && !error && <p className="text-gray-500">No hay libros disponibles.</p>}
            {books.map((book) => (
              <div key={book.id} className="rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
                <img
                  src={book.image_url || '/img/default_cover.jpg'}
                  alt={book.titulo}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate(`/books/${book.id}`, { state: { bookId: book.id } });
                    } else {
                      alert('Inicia sesión para ver el detalle y pedir un préstamo');
                    }
                  }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{book.titulo}</h2>
                  <p className="mb-2">{book.description}</p>
                  <p className="mb-1"><strong>Autor:</strong> {book.autor_ids ? book.autor_ids.map(id => authorsMap.get(id)).filter(name => name).join(', ') : 'Desconocido'}</p>
                  <p className="mb-1"><strong>Editorial:</strong> {book.editorial_ids ? book.editorial_ids.map(id => publishersMap.get(id)).filter(name => name).join(', ') : 'Desconocido'}</p>
                  <p><strong>Disponibilidad:</strong> {book.disponibilidad}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Catalog;
