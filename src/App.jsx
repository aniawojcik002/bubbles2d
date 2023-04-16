import { useState, useRef } from "react";
import { Circle, Grid, Edges, Center, Instances } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";

function App() {
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  <Instances 
  limit={30}
  range={30}
  >
    
  </Instances>
  function createCircleSmall({...props}) {
    return (
      <mesh>
        <Circle args={[0.1, 150]}>
          <meshBasicMaterial
            attach="material"
            transparent
            color={rgba(
              getRandom(0, 256),
              getRandom(0, 256),
              getRandom(0, 256)
            )}
          />
        </Circle>
      </mesh>
    );
  }
  function CircleSmall({...props}) {
    const ref = useRef();
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
          infiniteGrid={true}
          cellSize={0.25}
          rotation={[Math.PI / 2, 0, 0]}
          fadeStrength={1}
          fadeDistance={10}
          cellThickness={0.75}
          sectionColor={"#7FFFD4"}
          sectionSize={10}
        />

        <CircleSmall />
        <Circle args={[3, 150]}>
          <Edges
            scale={1}
            threshold={15}
            color="white"
          />
          <meshBasicMaterial attach="material" transparent opacity={0} />
        </Circle>
      </Center>
    </Canvas>
  );
}

export default App;
