import { useState, useRef, useEffect } from "react";
import {
  Circle,
  Grid,
  Edges,
  Center,
  Instances,
  Instance,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import { MathUtils } from "three";

function App() {
  // const r = Math.floor(minRGB + Math.random() * (maxRGB - minRGB))
  // const g = Math.floor(minRGB + Math.random() * (maxRGB - minRGB))
  // const b = Math.floor(minRGB + Math.random() * (maxRGB - minRGB))
  // const color = `rgba(${r},${g},${b},${alpha})`
  function GetRandomColor() {
    let red = MathUtils.randInt(0, 256);
    let green = MathUtils.randInt(0, 256);
    let blue = MathUtils.randInt(0, 256);
    let color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
  }
  const particles = Array.from({ length: 15 }, () => ({
    speed: MathUtils.randFloat(0.001, 0.005),
    xFactor: MathUtils.randFloatSpread(0.02),
    yFactor: MathUtils.randFloatSpread(0.02),
  }));

  function Bubbles({ xFactor, yFactor }) {
    const ref = useRef();

    return (
      <Instances
        limit={particles.length}
        ref={ref}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <circleGeometry args={[0.1, 150]} />
        <meshStandardMaterial transparent color={GetRandomColor()} />
        {particles.map((data, i) => (
          <Bubble key={i} {...data} /> //poprawić id
        ))}
      </Instances>
    );
  }

  function Bubble({ speed, xFactor, yFactor }) {
    const ref = useRef();
    useEffect(() => {
      ref.current.position.set(
        (ref.current.position.x += xFactor),
        (ref.current.position.y += yFactor)
      );
    });
    useFrame((state) => {
      ref.current.position.set(
        (ref.current.position.x += xFactor),
        (ref.current.position.y += yFactor)
      );
      const X_i = ref.current.position.x;
      const Y_i = ref.current.position.y;

      //checking if collision with the walls has occured;
      const d2 = Math.hypot(X_i, Y_i);
      if (d2 > 2.9) {
        let dx = 0 - X_i;
        let dy = 0 - Y_i;
        let len = Math.hypot(dx, dy);
        console.log(Math.hypot(3, 4));
        let nx = dx / len;
        let ny = dy / len;

        const xFactor_new = xFactor - 2 * (nx * xFactor + ny * yFactor) * nx;
        const yFactor_new = yFactor - 2 * (nx * xFactor + ny * yFactor) * ny;

        xFactor = xFactor_new;
        yFactor = yFactor_new;
      }
    });
    return <Instance ref={ref} color={GetRandomColor()} />;
  }

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <Grid
        position={[0, 0, 0]}
        infiniteGrid={true}
        cellSize={0.25}
        rotation={[Math.PI / 2, 0, 0]}
        fadeStrength={1}
        fadeDistance={10}
        cellThickness={0.75}
        sectionColor={"#7FFFD4"}
        sectionSize={10}
      />

      <Circle args={[3, 150]}>
        <Edges scale={1} threshold={15} color="white" />
        <meshBasicMaterial attach="material" transparent opacity={0} />
      </Circle>

      <Bubbles />
    </Canvas>
  );
}

export default App;
