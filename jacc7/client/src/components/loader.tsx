import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function Loader({ size = 'md', text, className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="animate-spin rounded-full border-b-2 border-blue-600">
        <Loader2 className={sizeClasses[size]} />
      </div>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {text}
        </p>
      )}
    </div>
  );
}

// Full screen loader component
export function FullScreenLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
      <Loader size="lg" text={text} />
    </div>
  );
}

// Inline loader component
export function InlineLoader({ size = 'sm', text }: { size?: 'sm' | 'md' | 'lg', text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader size={size} />
      {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  );
} 