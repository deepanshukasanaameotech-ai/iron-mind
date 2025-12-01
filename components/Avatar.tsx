import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface AvatarProps {
  isTalking: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ isTalking }) => {
  const headRef = useRef<Mesh>(null);
  const jawRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Idle Animation
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      headRef.current.position.y = Math.sin(time * 1) * 0.05;
    }

    // Talking Animation (Jaw movement)
    if (jawRef.current) {
      if (isTalking) {
        // Rapid up/down movement for talking
        jawRef.current.position.y = -0.5 + Math.sin(time * 20) * 0.1;
      } else {
        // Return to closed position
        jawRef.current.position.y = -0.4;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.5} /> {/* Darker skin tone */}
        
        {/* Eyes */}
        <mesh position={[-0.3, 0.2, 0.9]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="white" />
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>
        <mesh position={[0.3, 0.2, 0.9]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="white" />
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>

        {/* Jaw/Mouth */}
        <mesh ref={jawRef} position={[0, -0.4, 0.5]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 0.4, 32]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} />
        </mesh>
      </mesh>

      {/* Body/Neck */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.5, 1, 2, 32]} />
        <meshStandardMaterial color="#1a1a1a" /> {/* Black shirt */}
      </mesh>
    </group>
  );
};


