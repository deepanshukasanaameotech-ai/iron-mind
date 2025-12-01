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
    if (isTalking && jawRef.current) {
      // Simple jaw movement simulation
      jawRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 20) * 0.05;
    } else if (jawRef.current) {
      jawRef.current.position.y = -0.5;
    }

    if (headRef.current) {
      // Idle animation
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#5d4037" /> {/* Skin tone-ish */}
        
        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="white" />
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>
        <mesh position={[0.2, 0.1, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="white" />
          <mesh position={[0, 0, 0.08]}>
             <sphereGeometry args={[0.05, 16, 16]} />
             <meshStandardMaterial color="black" />
          </mesh>
        </mesh>
      </mesh>

      {/* Jaw/Mouth Area */}
      <mesh ref={jawRef} position={[0, -0.5, 0]}>
         {/* Neck/Lower Face */}
      </mesh>
      
      {/* Body/Torso */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 1.5, 32]} />
        <meshStandardMaterial color="#1a1a1a" /> {/* Black shirt */}
      </mesh>
    </group>
  );
};
