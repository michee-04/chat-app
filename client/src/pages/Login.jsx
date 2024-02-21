import React from 'react'
import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from './../context/AuthContext';


export default function Login() {

  const {
    loginUser,
    loginError,
    loginInfo,
    updateLoginInfo,
    isLoginLoading } = useContext(AuthContext);

  return (
    <>
      <Form onSubmit = {loginUser}>
        <Row style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "5%",
          }}>
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Connexion</h2>
              {/* Création des inputs */}
              <Form.Control 
                  type="email" 
                  placeholder="Email" 
                  onChange = {(e) => 
                    updateLoginInfo({ ...loginInfo, email: e.target.value })
                  }
                />
              <Form.Control 
                  type="password" 
                  placeholder="Password"
                  onChange = {(e) => 
                    updateLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                />
              <Button variant="primary" type="submit">
                { isLoginLoading ? "Vérification des information du compte...." : "Login"}
              </Button>

              {
                loginError?.error && (
                  <Alert variant="danger">
                    <p> {loginError?.message} </p>
                  </Alert>
                )
              }
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  )
}
