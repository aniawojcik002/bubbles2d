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

  function GetRandomColor() {
    let red = MathUtils.randInt(0, 256);
    let green = MathUtils.randInt(0, 256);
    let blue = MathUtils.randInt(0, 256);
    let color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
  }
  const particles = Array.from({ length: 15 }, () => ({
    gravity: 0.001,
    friction: 0.99,
    xVelocity: MathUtils.randFloatSpread(0.02),
    yVelocity: MathUtils.randFloatSpread(0.02),
  }));

  function Bubbles({ xVelocity, yVelocity }) {
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

  function Bubble({ gravity, friction, xVelocity, yVelocity }) {
    const ref = useRef();

    useFrame((state) => {
      ref.current.position.set(
        ref.current.position.x += xVelocity,
        ref.current.position.y += yVelocity,
        );
        yVelocity -= gravity;
      const X_i = ref.current.position.x;
      const Y_i = ref.current.position.y;

      //checking if collision with the walls has occured;
      const d2 = Math.hypot(X_i, Y_i);
      if (d2 > 2.9) {
        let dx = 0 - X_i;
        let dy = 0 - Y_i;
        let len = Math.hypot(dx, dy);

        let nx = dx / len;
        let ny = dy / len;
        yVelocity *= friction;
        //velocity after reflection
        const xVelocity_new = xVelocity - 2 * (nx * xVelocity + ny * yVelocity) * nx;
        const yVelocity_new = yVelocity - 2 * (nx * xVelocity + ny * yVelocity) * ny;

        xVelocity = xVelocity_new;
        yVelocity = yVelocity_new;
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
