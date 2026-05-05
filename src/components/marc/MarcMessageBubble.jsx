import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function MarcMessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 mt-0.5">
          <img src="https://media.base44.com/images/public/69e13864d740c55bded1c850/7f3a140dc_generated_image.png" alt="MARC" className="w-full h-full object-cover" />
        </div>
      )}

      <div className={cn('max-w-[80%]', isUser && 'flex flex-col items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-[#0F172A] text-white rounded-tr-sm'
            : 'bg-gray-100 border border-gray-200 text-[#0F172A] rounded-tl-sm'
        )}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                p: ({ children }) => <p className="my-1 leading-relaxed text-[#0F172A]">{children}</p>,
                strong: ({ children }) => <strong className="text-[#0F172A] font-semibold">{children}</strong>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc text-[#0F172A]">{children}</ul>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0F172A] underline font-semibold">
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
