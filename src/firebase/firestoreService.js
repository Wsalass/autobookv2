import { db } from './firebaseConfig';
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

// Función para agregar un libro
export const addBook = async (bookData) => {
  try {
    const docRef = await addDoc(collection(db, 'books'), bookData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
export const updateBook = async (bookId, bookData) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await setDoc(bookRef, bookData, { merge: true });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

// Función para eliminar un libro
export const deleteBook = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

// Función para obtener todos los libros
export const getBooks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'books'));
    const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return books;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};
