import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Avatar } from '../components/Avatar';
import { chatWithGoggins } from '../services/aiService';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const ChatYourDevils: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "WHO'S GONNA CARRY THE BOATS? ASK ME ANYTHING." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synth = window.speechSynthesis;

  const speak = async (text: string) => {
    if (isMuted) return;
    
    // Fallback to Browser TTS
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a deep/male voice
    const voices = synth.getVoices();
    const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David')) || voices[0];
    if (maleVoice) utterance.voice = maleVoice;
    
    utterance.pitch = 0.8; // Deeper
    utterance.rate = 1.1; // Faster/Intense

    utterance.onstart = () => setIsTalking(true);
    utterance.onend = () => setIsTalking(false);
    utterance.onerror = () => setIsTalking(false);

    synth.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Use dedicated chat function
      const response = await chatWithGoggins(userMsg);
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      speak(response);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "SYSTEM FAILURE. STAY HARD ANYWAY." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* 3D Scene Area */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0.5, 2.5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Environment preset="city" />
          
          <Avatar isTalking={isTalking} />
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.2} 
            maxPolarAngle={Math.PI / 1.8}
            target={[0, 0.5, 0]} 
          />
        </Canvas>

        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="h-1/3 bg-gray-900 border-t border-gray-800 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-lg animate-pulse text-gray-400">
                THINKING...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-black border-t border-gray-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Goggins..."
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatYourDevils;
