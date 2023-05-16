import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  Circle,
  Grid,
  Edges,
  Instances,
  Instance,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import { MathUtils } from "three";
import { createRef } from "react";

function App() {
  const particle_rad = 0.1;
  const cirlce_rad = 3;
  
  //helper function for random ball color
  function GetRandomColor() {
    let red = MathUtils.randInt(0, 256);
    let green = MathUtils.randInt(0, 256);
    let blue = MathUtils.randInt(0, 256);
    let color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
  }


  const Bubble = forwardRef(({ ball }, ref) => {
    const meshRef = useRef(null);
    const velocity = useRef({
      x: ball.xVelocityInitial,
      y: ball.yVelocityInitial,
    });

    const circleBounce = (x, y, velocity) => {
      //add gravity to y axis
      velocity.y -= ball.gravity;
      //distance between circle (0,0) center and ball
      const ballDistance = Math.hypot(x, y);

      //checking if ball touches Circle
      if (ballDistance >= cirlce_rad - particle_rad) {
        let dx = 0 - x;
        let dy = 0 - y;
        let len = Math.hypot(dx, dy);

        //normalization of dx, dy
        let nx = dx / len;
        let ny = dy / len;

        //decreasing of ball velocity aflter touching circle
        velocity.y *= ball.friction;

        // ball velocity after circle reflection
        const vel1AfterX =
          velocity.x - 2 * (nx * velocity.x + ny * velocity.y) * nx;
        const vel1AfterY =
          velocity.y - 2 * (nx * velocity.x + ny * velocity.y) * ny;

        // assigning new velocities to ball x and y
        velocity.x = vel1AfterX;
        velocity.y = vel1AfterY;
      }

      return velocity;
    };
    const checkingOverlap = () => {};

    useFrame((state, delta) => {
      let { x, y } = meshRef.current.position;
      let d = Math.hypot(x, y);

      circleBounce(x, y, velocity.current, delta);
      //checking if ball do not overlap circle and correcting position
      if (d > cirlce_rad - particle_rad) {
        let dx = x - 0;
        let dy = y - 0;

        dx /= d;
        dy /= d;

        // calculate correct position of ball
        const correctX = 0 + dx * (cirlce_rad - particle_rad);
        const correctY = 0 + dy * (cirlce_rad - particle_rad);

        // set ball position to correct position
        x = correctX;
        y = correctY;
      }

      meshRef.current.position.set(
        x + velocity.current.x,
        y + velocity.current.y
      );
    });
    useImperativeHandle(ref, () => ({
      getPosition: () => meshRef.current.position,
      getVelocity: () => velocity.current,
    }));
    return <Instance ref={meshRef} color={ball.color} />;
  });

  function Bubbles() {
    const ref = useRef(Array.from({ length: 40 }, () => useRef(null)));

    const particles = Array.from({ length: 40 }, () => ({
      //default value for animation
      gravity: 0.0005,
      friction: 0.99,
      xVelocityInitial: MathUtils.randFloatSpread(0.05),
      yVelocityInitial: MathUtils.randFloatSpread(0.05),
      color: GetRandomColor(),
    }));

    //helper function for distance between two balls
    function checkDistance(ball1, ball2) {
      const dx = ball1.x - ball2.x;
      const dy = ball1.y - ball2.y;
      const d = Math.hypot(dx, dy);
      return d;
    }
    // calculates velocity after collision
    const collisionResponse = (ball1, ball2, i, j) => {
      let dx = ball1.x - ball2.x;
      let dy = ball1.y - ball2.y;

      const len = Math.hypot(dx, dy);

      const nx = dx / len;
      const ny = dy / len;
      const tx = -ny;
      const ty = nx;

      const correctionX = nx * (particle_rad + particle_rad);
      const correctionY = ny * (particle_rad + particle_rad);

      //correction to ball 1 position to not
      ref.current[i].current.getPosition().x = ball2.x + correctionX;
      ref.current[i].current.getPosition().y = ball2.y + correctionY;

      //velocity in normal direction
      const v1n = ball1.vx * nx + ball1.vy * ny;
      const v2n = ball2.vx * nx + ball2.vy * ny;
      //velocity in tangential  direction
      const v1t = ball1.vx * tx + ball1.vy * ty;
      const v2t = ball2.vx * tx + ball2.vy * ty;

      // total velocity after collision
      const v1n_after =
        (v1n * (particle_rad - particle_rad) + 2 * particle_rad * v2n) /
        (particle_rad + particle_rad);

      const v2n_after =
        (v2n * (particle_rad - particle_rad) + 2 * particle_rad * v1n) /
        (particle_rad + particle_rad);

      // Calculate the new total velocities
      const vel1AfterX = v1n_after * nx + v1t * tx;
      const vel1AfterY = v1n_after * ny + v1t * ty;
      const vel2AfterX = v2n_after * nx + v2t * tx;
      const vel2AfterY = v2n_after * ny + v2t * ty;

      // ball1.vx = vel1AfterX;
      // ball1.vy = vel1AfterY;
      // ball2.vx = vel2AfterX;
      // ball2.vy = vel2AfterY;

      ref.current[i].current.getVelocity().x = vel1AfterX;
      ref.current[i].current.getVelocity().y = vel1AfterY;
      ref.current[j].current.getVelocity().x = vel2AfterX;
      ref.current[j].current.getVelocity().y = vel2AfterY;
    };

    useFrame((state, delta) => {
      setTimeout(() => {
        for (let i = 0; i < particles.length; i++) {
          const ball1 = {
            x: ref.current[i].current.getPosition().x,
            y: ref.current[i].current.getPosition().y,
            vx: ref.current[i].current.getVelocity().x,
            vy: ref.current[i].current.getVelocity().y,
          };

          if (!ball1) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const ball2 = {
              x: ref.current[j].current.getPosition().x,
              y: ref.current[j].current.getPosition().y,
              vx: ref.current[j].current.getVelocity().x,
              vy: ref.current[j].current.getVelocity().y,
            };

            if (!ball2) continue;
            const d = checkDistance(ball1, ball2);

            if (d <= particle_rad + particle_rad) {
              collisionResponse(ball1, ball2, i, j);
            }
          }
        }
      }, 1000); //1 second delay before collision detecting and responsing
    });
    return (
      <Instances limit={particles.length} position={[0, 0, 0]}>
        <circleGeometry args={[particle_rad, 100]} />
        <meshStandardMaterial transparent />

        {particles.map((data, i) => (
          <Bubble
            key={i}
            ref={ref.current[i]}
            ball={{ id: i, ...data }}
            {...data}
          />
        ))}
      </Instances>
    );
  }

  return (
    <Canvas>
      <pointLight position={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <Grid
        infiniteGrid={true}
        cellSize={0.25}
        rotation={[Math.PI / 2, 0, 0]}
        fadeStrength={1}
        fadeDistance={10}
        cellThickness={0.75}
        sectionColor={"#7FFFD4"}
        sectionSize={10}
      />

      <Circle args={[cirlce_rad, 150]}>
        <Edges scale={1} color="white" />
        <meshBasicMaterial attach="material" transparent opacity={0} />
      </Circle>

      <Bubbles />
    </Canvas>
  );
}

export default App;
