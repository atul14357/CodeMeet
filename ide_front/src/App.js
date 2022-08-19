import "./App.css";
import React from "react";
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Editor from "./components/Editor";
import Home from "./components/newRoom"
import {Toaster} from 'react-hot-toast'


function App() {
  return (
    <>
     <div>
      <Toaster
       position="top-right"
       toastOptions={{
        succes:{
          theme:{
            primary: '#4aed88'
          }
        }
       }}
      ></Toaster>
     </div>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/editor/:roomId" element={<Editor></Editor>}></Route>
      </Routes>
     </BrowserRouter>
    
    </>
  );
}

export default App;
