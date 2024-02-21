import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap";
import CustomNavbar from './components/CustomNavbar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';


export default function App() {

  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider user = {user}>
      <CustomNavbar />
      <Container>
        <Routes>
          <Route path="/" element={ user ? <Chat /> : <Login /> } />
          <Route path="/register" element={ user ? <Chat /> : <Register /> } />
          <Route  path="/login" element={ user ? <Chat /> : <Login /> } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  )
}
