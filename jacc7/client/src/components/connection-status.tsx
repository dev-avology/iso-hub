import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  isConnected?: boolean;
  className?: string;
}

export default function ConnectionStatus({ isConnected = true, className = '' }: ConnectionStatusProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Connected to ISO-Hub
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Disconnected
          </Badge>
        </>
      )}
    </div>
  );
}

// Compact version for small spaces
export function CompactConnectionStatus({ isConnected = true }: { isConnected?: boolean }) {
  return (
    <div className="flex items-center justify-center">
      {isConnected ? (
        <Wifi className="w-4 h-4 text-green-500" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
} 