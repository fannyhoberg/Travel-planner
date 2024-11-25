import { Route, Routes } from "react-router-dom";
import "./assets/scss/App.scss";
import Home from "./pages/Home";

function App() {
  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
