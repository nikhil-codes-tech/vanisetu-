import React from 'react';

export default function Avatar({ name = '', emoji = '', size = 'md', border = false }) {
  // Hash name to get a deterministic gradient
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const gradients = [
    'from-pink-400 to-orange-400',
    'from-purple-400 to-indigo-500',
    'from-emerald-450 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-blue-500',
    'from-rose-400 to-pink-500',
  ];
  
  const gradient = gradients[Math.abs(hash) % gradients.length];
  
  // Compute initials
  let initials = '';
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      initials = parts[0][0] + parts[1][0];
    } else {
      initials = name.slice(0, 2);
    }
  }

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  };

  const activeSize = sizeClasses[size] || sizeClasses.md;
  const borderClass = border ? 'border-2 border-white shadow-sm' : '';

  return (
    <div className={`${activeSize} ${borderClass} rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-extrabold select-none flex-shrink-0 shadow-inner`}>
      {emoji ? (
        <span className={size === 'xl' ? 'text-3xl' : size === 'lg' ? 'text-xl' : 'text-base'}>{emoji}</span>
      ) : (
        <span className="uppercase tracking-wider">{initials}</span>
      )}
    </div>
  );
}
