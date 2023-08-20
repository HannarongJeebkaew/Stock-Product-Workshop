import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter ,Routes,Route} from "react-router-dom";
import Adminroute from './routes/adminroute';
import Dataproducttable from "./components/pages/Dataproducttable";
function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route element={<Adminroute></Adminroute> }path="/"></Route>
      <Route element={<Adminroute><Dataproducttable></Dataproducttable></Adminroute> }path="/admin/viewtable"></Route>
     </Routes>
    </BrowserRouter>
  );
}

export default App;
