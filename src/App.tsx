import { Route, Routes } from "react-router-dom";
import "./assets/scss/App.scss";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
