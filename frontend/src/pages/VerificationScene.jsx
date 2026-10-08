import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils } from "three";

function Parcel({ animate }) {
  const parcel = useRef(null);
  const scanner = useRef(null);
  const orbit = useRef(null);
  const elapsed = useRef(0);

useFrame((state, delta) => {
    if (!animate) return;

// Prevent large jumps when resuming after a pause.
    const step = Math.min(delta, 0.05);
    elapsed.current += step;
    const time = elapsed.current;

const x = MathUtils.clamp(state.pointer.x, -1, 1);
    const y = MathUtils.clamp(state.pointer.y, -1, 1);

parcel.current.position.y = Math.sin(time * 1.1) * 0.09;

parcel.current.rotation.y = MathUtils.damp(
      parcel.current.rotation.y,
      -0.5 + x * 0.18 + Math.sin(time * 0.25) * 0.12,
      3,
      step
    );

parcel.current.rotation.x = MathUtils.damp(
      parcel.current.rotation.x,
      0.12 - y * 0.08,
      3,
      step
    );

scanner.current.position.y = Math.sin(time * 1.25) * 0.92;
    orbit.current.rotation.z += step * 0.09;
  });

return (
    <group>
      <group ref={parcel} rotation={[0.12, -0.5, 0.04]}>
        {/* Main parcel */}
        <mesh>
          <boxGeometry args={[1.8, 1.65, 1.65]} />
          <meshStandardMaterial
            color="#a7794c"
            roughness={0.78}
            metalness={0.05}
          />
        </mesh>

{/* Packing tape: top, front, and back */}
        <mesh position={[0, 0.829, 0]}>
          <boxGeometry args={[0.32, 0.012, 1.66]} />
          <meshStandardMaterial color="#d6b27c" roughness={0.5} />
        </mesh>

<mesh position={[0, 0, 0.829]}>
          <boxGeometry args={[0.32, 1.65, 0.012]} />
          <meshStandardMaterial color="#c7a16c" roughness={0.55} />
        </mesh>

<mesh position={[0, 0, -0.829]}>
          <boxGeometry args={[0.32, 1.65, 0.012]} />
          <meshStandardMaterial color="#c7a16c" roughness={0.55} />
        </mesh>

{/* Shipping label */}
        <mesh position={[0.49, 0.16, 0.843]}>
          <planeGeometry args={[0.52, 0.66]} />
          <meshStandardMaterial color="#f0eee5" roughness={0.9} />
        </mesh>

{/* Geometric barcode; no image texture needed */}
        {Array.from({ length: 10 }, (_, index) => (
          <mesh
            key={index}
            position={[0.29 + index * 0.043, 0.18, 0.851]}
          >
            <planeGeometry
              args={[index % 3 === 0 ? 0.022 : 0.012, 0.32]}
            />
            <meshBasicMaterial color="#152133" />
          </mesh>
        ))}

{/* Fine verification cage */}
        <mesh scale={1.065}>
          <boxGeometry args={[1.8, 1.65, 1.65]} />
          <meshBasicMaterial
            color="#67dcff"
            wireframe
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </mesh>

{/* Moving horizontal scan sheet */}
        <group ref={scanner}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.35, 2.2]} />
            <meshBasicMaterial
              color="#4bdcff"
              transparent
              opacity={0.12}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>

<mesh position={[0, 0, 1.1]}>
            <boxGeometry args={[2.35, 0.018, 0.018]} />
            <meshBasicMaterial color="#8cecff" />
          </mesh>

<mesh position={[0, 0, -1.1]}>
            <boxGeometry args={[2.35, 0.018, 0.018]} />
            <meshBasicMaterial color="#8cecff" />
          </mesh>
        </group>
      </group>

{/* Circular plinth */}
      <mesh position={[0, -1.48, 0]}>
        <cylinderGeometry args={[2.05, 2.18, 0.13, 64]} />
        <meshStandardMaterial
          color="#111f34"
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>

<mesh
        position={[0, -1.405, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.84, 1.855, 64]} />
        <meshBasicMaterial color="#3abbe9" side={DoubleSide} />
      </mesh>

{/* Tilted orbital arc */}
      <group rotation={[0.85, 0.25, 0]}>
        <group ref={orbit}>
          <mesh>
            <torusGeometry args={[2.35, 0.008, 6, 96, Math.PI * 1.6]} />
            <meshBasicMaterial
              color="#429fc9"
              transparent
              opacity={0.5}
            />
          </mesh>

<mesh position={[2.35, 0, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#a4f1ff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function VerificationScene({ animate }) {
  return (
    <Canvas
      camera={{ position: [4.2, 2.8, 6.4], fov: 40 }}
      dpr={[1, 1.5]}
      frameloop={animate ? "always" : "demand"}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1.1} />

<directionalLight
        position={[3, 5, 4]}
        intensity={3}
        color="#e1f2ff"
      />

<directionalLight
        position={[-4, 1, -2]}
        intensity={3}
        color="#268aff"
      />

<pointLight
        position={[0, -0.3, 3]}
        intensity={5}
        color="#63d9ff"
        distance={8}
      />

<Parcel animate={animate} />
    </Canvas>
  );
}
