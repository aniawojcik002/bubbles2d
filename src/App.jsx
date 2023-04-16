import { useState, useRef } from "react";
import {
  Circle,
  Grid,
  Edges,
  Center,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";

function App() {
  
  function CircleSmall(props) {
    const ref = useRef();
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame(
      (state, delta) => (
        (ref.current.position.x += 0.01), (ref.current.position.y += 0.01)
      )
    );
    return (
      <mesh {...props} ref={ref}>
        <Circle args={[0.1, 150]}>
          <meshBasicMaterial
            attach="material"
            transparent
            color="rgba(75, 160, 255, 1)"
          />
        </Circle>
      </mesh>
    );
  }
  return (
    <Canvas>
      <Center>
        <ambientLight intensity={0.5} />
        <Grid
          position={[0, 0, 0]}
          // args={[15, 15]}
          infiniteGrid={true}
          cellSize={0.25}
          rotation={[Math.PI / 2, 0, 0]}
          fadeStrength={1}
          fadeDistance={10}
          // cellColor={"#fff"}
          cellThickness={0.75}
          sectionColor={'#7FFFD4'}
          sectionSize={10}
        />

        <CircleSmall></CircleSmall>
        <Circle args={[3, 150]}>
          <Edges
            scale={1}
            threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
            color="white"
          />
          <meshBasicMaterial
            attach="material"
            transparent opacity={0}
          />
        </Circle>
      </Center>
    </Canvas>
  );
}

export default App;
