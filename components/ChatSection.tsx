"use client";
import { useState, useEffect, useRef } from 'react';
import { databases, DB_ID } from '../lib/appwrite';
import { User } from '../types/user';
import { Query } from 'appwrite';
import { Models } from 'appwrite';
import { Client } from 'appwrite';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '../lib/theme';

const MESSAGES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

interface ChatSectionProps {
  meetupId: string;
  user: User;
}

interface Message extends Models.Document {
  message: string;
  userId: string;
  meetupId: string;
  createdAt: string;
  userName?: string;
}

export default function ChatSection({ meetupId, user }: ChatSectionProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(
          DB_ID,
          MESSAGES_COLLECTION_ID,
          [Query.equal('meetupId', meetupId)]
        );
        setMessages(response.documents as Message[]);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
    
    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`,
      response => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newMessage = response.payload as Message;
          if (newMessage.meetupId === meetupId) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [meetupId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await databases.createDocument(
        DB_ID,
        MESSAGES_COLLECTION_ID,
        'unique()',
        {
          message: newMessage.trim(),
          meetupId: meetupId,
          userId: user.$id,
          userName: user.name,
          createdAt: new Date().toISOString()
        }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={`
      rounded-xl shadow-lg p-4 md:p-6 max-w-3xl mx-auto
      ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
    `}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`
          text-xl font-semibold
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          Chat
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className={`
            px-3 py-1 text-sm rounded-lg flex items-center gap-1
            ${theme === 'dark' ? 
              'bg-gray-700 text-gray-300 hover:bg-gray-600' : 
              'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <span>←</span> Back
        </motion.button>
      </div>
      
      <div className={`
        h-[calc(100vh-300px)] overflow-y-auto mb-4 p-4 rounded-lg
        ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
      `}>
        {messages.map((message) => (
          <motion.div 
            key={message.$id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 ${message.userId === user.$id ? 'text-right' : ''}`}
          >
            <div 
              className={`
                inline-block p-3 rounded-lg max-w-[85%] break-words
                ${message.userId === user.$id ?
                  (theme === 'dark' ? 
                    'bg-blue-600 text-white' : 
                    'bg-blue-500 text-white') :
                  (theme === 'dark' ? 
                    'bg-gray-600 text-white' : 
                    'bg-gray-200 text-gray-900')
                }
              `}
            >
              {message.userId !== user.$id && (
                <p className="text-xs opacity-75 mb-1">
                  {message.userName || 'Anonymous'}
                </p>
              )}
              <p className="text-sm md:text-base">{message.message}</p>
              <p className={`
                text-xs opacity-75 mt-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
              `}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className={`
            flex-1 p-2 rounded-lg text-sm md:text-base
            ${theme === 'dark' ? 
              'bg-gray-700 text-white placeholder-gray-400' : 
              'bg-gray-100 text-gray-900 placeholder-gray-500'
            }
          `}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm md:text-base whitespace-nowrap
            ${theme === 'dark' ? 
              'bg-blue-600 hover:bg-blue-500 text-white' : 
              'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
} 