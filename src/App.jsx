import React from "react";
import Navbar from "./Components/Navbar";
import PasswordManager from "./Components/PasswordManager";
import Footer from "./Components/Footer"



function App() {
  return (
    <div className="relative">
      <Navbar />
      <PasswordManager />
      <Footer />
    </div>
  );
}

export default App;
