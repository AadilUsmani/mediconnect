import React from 'react';

interface UserAvatarProps {
  name: string;
  className?: string;
}

// Generate a consistent color based on a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-red-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-teal-600',
    'bg-orange-600',
  ];
  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({ name, className = '' }: UserAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colorClass = name ? stringToColor(name) : 'bg-gray-400';

  return (
    <div
      className={`flex items-center justify-center text-white font-bold rounded-full ${colorClass} ${className}`}
      style={{ width: '40px', height: '40px' }}
    >
      {initial}
    </div>
  );
}
