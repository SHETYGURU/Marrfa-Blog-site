import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import SearchPage from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword'; 
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<SearchPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;
