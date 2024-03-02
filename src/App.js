import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";
import './App.css';
import Upload from "./components/Upload/Upload";
import Compare from "./components/Compare/Compare";

function App() {
    const [init, setInit] = useState(false);
    const pathname = window.location.pathname;

    // Particles (BG) engine
    useEffect(() => {
        if (init) {
            return;
        }
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, [init]);
    
    return (
        <div className="App" >
            {init && <Particles options={particlesOptions} />}
            {(pathname.toLowerCase() === '/compare')? <Compare /> : <Upload />}
        </div>
    );
}

export default App;
