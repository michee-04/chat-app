import React from 'react'
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './../context/AuthContext';

export default function CustomNavbar() {

  const { user, logoutUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75em"}}>
        <Container>
            <h2>
                <Link to="/" className="Link-light text-decoration-none" style={{ color: "white" }}>
                    Mic-chat-App
                </Link>
            </h2>
            { user && (
                <span className="text-warning">Connectée {user?.name} </span>
                )}
            <Nav>
              <Stack direction="horizontal" gap={3}>

                {
                  user && (
                    <>
                      <Link
                        onClick={() => logoutUser()}
                        to="/login" 
                        className="Link-light text-decoration-none"
                        >
                        Logout
                      </Link>
                    </>
                  )
                }

                {
                  !user && (
                    <>
                      <Link to="/login" className="Link-light text-decoration-none">
                        Login
                      </Link>
                      <Link to="/register" className="Link-light text-decoration-none">
                        Register
                      </Link>
                    </>
                  )
                }
                
              </Stack>
            </Nav>
        </Container>
    </Navbar>
  )
}
