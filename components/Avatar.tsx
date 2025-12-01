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
      // Traverse to find bones for posing
      scene.traverse((child) => {
        if (child instanceof THREE.Bone) {
          // Map head for animation
          if (child.name === 'Head' || child.name === 'Neck') {
            headRef.current = child;
          }
          
          // Force arms down for "Military Stance" (A-pose -> I-pose)
          if (child.name.includes('Arm') || child.name.includes('Shoulder')) {
            // Adjust rotation to bring arms to side
            // Exact axis depends on model rigging, usually Z or X for arms
            if (child.name.includes('LeftUpArm')) {
              child.rotation.z = Math.PI / 3.5; // Rotate down
            }
            if (child.name.includes('RightUpArm')) {
              child.rotation.z = -Math.PI / 3.5; // Rotate down
            }
          }
        }
      });
    }
  }, [scene]);

  useFrame((state) => {
    if (!avatarRef.current) return;

    const time = state.clock.getElapsedTime();

    // Military Idle: Very stiff, minimal movement
    // Breathing only
    avatarRef.current.position.y = -1.6 + Math.sin(time * 0.5) * 0.005;
    
    // Head follows mouse/camera slightly but stays mostly rigid
    if (headRef.current) {
      // Subtle idle sway
      headRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
    }

    // Talking Animation: Sharp, disciplined jaw/head movement
    if (isTalking) {
      const talkIntensity = Math.sin(time * 25) * 0.03; // Faster, smaller movements
      if (headRef.current) {
        headRef.current.rotation.x = talkIntensity;
      }
    } else {
      // Snap back to attention
      if (headRef.current) {
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.2);
      }
    }
  });

  return (
    <group ref={avatarRef} dispose={null}>
      {/* Scale up slightly and position lower for "Zoomed In" feel */}
      <primitive object={scene} scale={2.2} position={[0, -1.8, 0]} />
    </group>
  );
};

// Preload the model
useGLTF.preload('https://models.readyplayer.me/692d7ac2eb3489c470f7cd59.glb');


