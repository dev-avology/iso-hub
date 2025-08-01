import React from 'react';
import HtmlContentRenderer from './html-content-renderer';

interface MessageContentProps {
  content: string;
  className?: string;
}

export function MessageContent({ content, className = '' }: MessageContentProps) {
  // Use the user-friendly HTML content renderer
  return <HtmlContentRenderer content={content} className={className} />;
}