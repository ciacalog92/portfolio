import './App.css';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';


function CarModel() {
  // Carica il modello utilizzando useGLTF
  const { scene } = useGLTF('./car-model.glb'); // Percorso del file nella cartella public
  return <primitive object={scene} scale={0.5} />;
}

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.5} /> {/* Luce ambientale */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> {/* Luce spot */}
        <CarModel /> {/* Modello dell'auto */}
        <OrbitControls /> {/* Controlli per ruotare e zoomare nella scena */}
      </Canvas>
    </div>
  );
}

export default App;

