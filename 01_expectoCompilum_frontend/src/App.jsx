import {Routes, Route} from "react-router";
import Homepage from "./01_pages/Homepage";
import Login from "./01_pages/Login";
import Signup from "./01_pages/Signup";
export default function App(){
  return(<>
    <Routes>
      <Route path="/" element={<Homepage/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
    </Routes>
  </>)
}
