"use client";
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import robotoFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { useEffect, useRef, useState } from 'react';
import fetchMultipleTokensData from '../api/fetchMultipleTokensData';
import '../App.css';

// Extend Three.js controls and geometry
extend({ OrbitControls: ThreeOrbitControls, TextGeometry });

const CameraController = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useFrame(() => {
    controls.current.update();
  });

  return <orbitControls ref={controls} args={[camera, gl.domElement]} />;
};

const Bar = ({ position, height, color, label, value }) => {
  const ref = useRef();
  const textRef = useRef();
  const priceRef = useRef();
  const font = new FontLoader().parse(robotoFont);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  useFrame(() => {
    if (ref.current.scale.y < height) {
      ref.current.scale.y += 0.02;
    }
    textRef.current.lookAt(camera.position);  // Label menghadap kamera
    priceRef.current.lookAt(camera.position); // Harga menghadap kamera
    if (hovered) {
      ref.current.material.color.set('#FFD700'); // Warna saat hover
    } else {
      ref.current.material.color.set(color);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        position={[0, height / 2, 0]}
        scale={[1, 1, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Label Nama Token */}
      <mesh position={[0, -1.2, 0]} ref={textRef}>
        <textGeometry args={[label, { font, size: 0.3, height: 0.05 }]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Harga */}
      <mesh position={[0, height + 1, 0]} ref={priceRef}>
        <textGeometry args={[`$${value}`, { font, size: 0.25, height: 0.05 }]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </group>
  );
};

const CryptoBarChart = () => {
  const [tokensData, setTokensData] = useState([]);

  useEffect(() => {
    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 
      'SOLUSDT', 'DOTUSDT', 'LTCUSDT', 'BCHUSDT', 'LINKUSDT'
    ];

    const fetchData = async () => {
      const data = await fetchMultipleTokensData(symbols);
      setTokensData(data);
    };

    fetchData();
  }, []);

  const normalizeLog = (value) => Math.log10(value + 1);
  const colors = ['#1E90FF', '#32CD32', '#FF4500', '#FFD700', '#20B2AA', '#FF6347', '#4682B4', '#8A2BE2', '#DAA520', '#FF69B4'];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Crypto 3D Data Visualization</h1>
        <p>Real-time 3D visualization of cryptocurrency prices</p>
      </header>

      <Canvas style={{ height: '70vh', width: '100%' }} camera={{ position: [10, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {tokensData.map((tokenData, index) => {
          const height = normalizeLog(tokenData.prices[0].close) * 4;
          const position = [index * 3, 0, 0];
          return (
            <Bar
              key={tokenData.symbol}
              position={position}
              height={height}
              color={colors[index % colors.length]}
              label={tokenData.symbol}  // Label ditampilkan
              value={tokenData.prices[0].close.toFixed(2)}
            />
          );
        })}

        <CameraController />
      </Canvas>

      <footer className="app-footer">
        <p>Created by Yudistira Putra |
          <a href="https://www.linkedin.com/in/yudistira-putra-dev" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style={{ width: '20px', height: '20px' }} />
          </a> |
          <a href="https://github.com/Yudis-bit" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style={{ width: '20px', height: '20px' }} />
          </a>
        </p>
      </footer>
    </div>
  );
};

export default CryptoBarChart;
