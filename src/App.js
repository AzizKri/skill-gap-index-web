import React from "react";
import './App.css';
import Upload from "./components/Upload/Upload";
import Compare from "./components/Compare/Compare";

function App() {
    const pathname = window.location.pathname;
    
    return (
        <div className="App" >
            {(pathname.toLowerCase() === '/compare')? <Compare /> : <Upload />}
        </div>
    );
}

export default App;
