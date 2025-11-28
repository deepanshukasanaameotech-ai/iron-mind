import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' }> = ({ variant = 'primary', className, ...props }) => {
  const baseStyle = "px-4 py-2 font-mono text-sm font-bold uppercase transition-all duration-200 tracking-wider flex items-center justify-center";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    outline: "border border-neutral-700 text-neutral-400 hover:border-emerald-500 hover:text-emerald-500 bg-transparent",
    danger: "bg-red-900/50 text-red-200 border border-red-800 hover:bg-red-800"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className, title }) => (
  <div className={`bg-neutral-900 border border-neutral-800 p-6 ${className}`}>
    {title && <h3 className="text-emerald-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 border-b border-neutral-800 pb-2">{title}</h3>}
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-3 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
    {...props}
  />
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-neutral-800' }) => (
  <span className={`${color} text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-wide`}>
    {children}
  </span>
);
