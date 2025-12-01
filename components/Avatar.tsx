import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isTalking: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ isTalking }) => {
  // Load User-Provided Ready Player Me model (David Goggins)
  const { scene } = useGLTF('https://models.readyplayer.me/692d7ac2eb3489c470f7cd59.glb');
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (scene) {
      // Try to find the head bone for more natural movement
      scene.traverse((child) => {
        if (child.name === 'Head' || child.name === 'Neck') {
          headRef.current = child;
        }
      });
    }
  }, [scene]);

  useFrame((state) => {
    if (!avatarRef.current) return;

    const time = state.clock.getElapsedTime();

    // Idle Animation: Subtle breathing/sway
    avatarRef.current.position.y = -1.5 + Math.sin(time * 1) * 0.02;
    avatarRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;

    // Talking Animation: Rapid jaw/head movement
    if (isTalking) {
      // Shake head slightly when talking for emphasis
      const talkIntensity = Math.sin(time * 20) * 0.05;
      if (headRef.current) {
        headRef.current.rotation.x = talkIntensity;
      } else {
        // Fallback if bone not found
        avatarRef.current.rotation.x = talkIntensity;
      }
    } else {
      // Reset head rotation
      if (headRef.current) {
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={avatarRef} dispose={null}>
      <primitive object={scene} scale={2} position={[0, -2, 0]} />
    </group>
  );
};

// Preload the model
useGLTF.preload('https://models.readyplayer.me/692d7ac2eb3489c470f7cd59.glb');


