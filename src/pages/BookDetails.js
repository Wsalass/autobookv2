import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookRef = doc(db, 'libros', id);
        const bookDoc = await getDoc(bookRef);

        if (bookDoc.exists()) {
          const bookData = bookDoc.data();
          setBook(bookData);

          if (bookData.autor_id) {
            const authorRef = doc(db, 'autores', bookData.autor_id);
            const authorDoc = await getDoc(authorRef);
            if (authorDoc.exists()) {
              setAuthor(authorDoc.data());
            }
          }

          if (bookData.editorial_id) {
            const publisherRef = doc(db, 'editoriales', bookData.editorial_id);
            const publisherDoc = await getDoc(publisherRef);
            if (publisherDoc.exists()) {
              setPublisher(publisherDoc.data());
            }
          }
        } else {
          console.log('No se encontró el libro');
        }
      } catch (error) {
        console.error('Error al cargar libro:', error.message);
      }
    };

    fetchBook();
  }, [id]);

  const handleLoanRequest = () => {
    navigate(`/loan-request/${id}`);
  };

  if (!book) return <div>Cargando...</div>;

  return (
    <div className="max-w-screen-lg min-h-screen mx-auto p-6 shadow-2xl rounded-lg">
      <main className="mt-6">
        <div className="flex flex-col md:flex-row">
          <img
            src={book.image_url || '/img/default_cover.jpg'}
            alt={book.titulo}
            className="w-full md:w-1/3 h-80 object-cover rounded-lg"
          />
          <div className="md:ml-6 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold mb-4">{book.titulo}</h1>
            <p className="mb-4">{book.description}</p>
            <p className="mb-2"><strong>Autor:</strong> {author ? author.nombre : 'Desconocido'}</p>
            <p className="mb-2"><strong>Editorial:</strong> {publisher ? publisher.nombre : 'Desconocido'}</p>
            <p className="mb-4"><strong>Disponibilidad:</strong> {book.disponibilidad}</p>
            {book.disponibilidad && (
              <button
                onClick={handleLoanRequest}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Solicitar Préstamo
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
