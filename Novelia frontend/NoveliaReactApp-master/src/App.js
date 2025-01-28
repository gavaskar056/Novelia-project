// import logo from './logo.svg';
import React from "react";
import Main from './components/main';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

function App() {
  return (
    <Router>
        <Main />
    </Router>
  )
}

export default App;
