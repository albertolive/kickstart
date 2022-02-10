import "semantic-ui-css/semantic.min.css";
import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";

const Layout = ({ children }) => (
  <Container>
    <Header />
    {children}
  </Container>
);

export default Layout;
