import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { addDays, format } from 'date-fns'; 
import Header from '../components/Header'; 

const LoanForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [book, setBook] = useState('');
  const [books, setBooks] = useState([]);
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const booksCollection = collection(db, 'libros');
        const booksSnapshot = await getDocs(booksCollection);
        const booksList = booksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksList);
      } catch (error) {
        console.error('Error al cargar los libros:', error);
        setError('Error al cargar los libros.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const loanDate = new Date();
    const calculatedReturnDate = addDays(loanDate, 30);
    setReturnDate(format(calculatedReturnDate, 'yyyy-MM-dd'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !book) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'prestamos'), {
        nombre: name,
        correo: email,
        libro_id: book,
        fecha_devolucion: returnDate,
        fecha_prestamo: new Date()
      });

      alert('Préstamo registrado con éxito.');
      setName('');
      setEmail('');
      setBook('');
    } catch (error) {
      console.error('Error al registrar el préstamo:', error);
      setError('Hubo un error al registrar el préstamo.');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto p-4 shadow-lg min-h-screen rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white mb-4">
            Formulario de Préstamo
          </h1>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="book">
              Libro a prestar
            </label>
            <select
              id="book"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={book}
              onChange={(e) => setBook(e.target.value)}
              required
            >
              <option value="">Selecciona un libro</option>
              {isLoading ? (
                <option>Cargando libros...</option>
              ) : (
                books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.titulo} 
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="returnDate">
              Fecha de Devolución
            </label>
            <input
              id="returnDate"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={returnDate}
              readOnly
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Confirmar Préstamo
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoanForm;
