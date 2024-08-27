import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

// Hook para manejar operaciones en Firestore
export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docs);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDocuments();
  }, [collectionName]);

  const addDocument = async (docData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateDocument = async (docId, docData) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, docData, { merge: true });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteDocument = async (docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    documents,
    error,
    addDocument,
    updateDocument,
    deleteDocument
  };
};
