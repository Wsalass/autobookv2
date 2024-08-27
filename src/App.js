import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import Register from './pages/Register';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import VerifyEmail from './components/VerifyEmail';
import Footer from './components/Footer';
import BookCRUD from './pages/Admin/BookCRUD';
import Profile from './pages/Profile';
import UpdateInfo from './pages/UpdateInfo';
import Prestamos from './pages/LoanRequest';
import LoanRequest from './pages/LoanRequest';

function App() {
  return (
    <Router>
      <div className="min-h-screen rounded transition-colors duration-300 ease-in-out bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/confirm-email" element={<VerifyEmail />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/admin/books" element={<BookCRUD />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update-info" element={<UpdateInfo />} />
            <Route path="/loan-request/:id" element={<LoanRequest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
