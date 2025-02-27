"use client"; // Client component for interactivity
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { useTheme } from '../lib/theme';
import { motion } from 'framer-motion';
import { HeaderProps } from '../types/components';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import AuthModal from './AuthModal';

export default function Header({ user, onLogout }: HeaderProps) {
  // const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { theme, toggleTheme } = useTheme();

  const handleAuthClick = (view: 'login' | 'signup') => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed w-full top-0 z-50 backdrop-blur-lg flex justify-between items-center px-6 py-4 shadow-sm",
          theme === 'dark' ? 'bg-black/80 text-white' : 'bg-white/80'
        )}
      >
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold"
        >
          Remote Meetup
        </motion.h1>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-blue-600"
            />
            {/* <span>🌙</span> */}
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">{user.name}</span>
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className={cn(
                  "hover:bg-opacity-20",
                  theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
                )}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => handleAuthClick('login')}
                variant="ghost"
              >
                Login
              </Button>
              <Button 
                onClick={() => handleAuthClick('signup')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </motion.header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />
    </>
  );
}
