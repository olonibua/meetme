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
import { Menu } from "lucide-react";

export default function Header({ user, onLogout }: HeaderProps) {
  // const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          theme === 'dark' ? 'bg-black/80 text-white' : 'bg-white'
        )}
      >
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          className="text-lg sm:text-2xl font-bold"
        >
          Remote Meetup
        </motion.h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-blue-600"
            />
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

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className={cn(
            "h-6 w-6",
            theme === 'dark' ? 'text-white' : 'text-black'
          )} />
        </motion.button>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0,
            x: isMobileMenuOpen ? 0 : "100%" 
          }}
          transition={{ type: "spring", bounce: 0.1 }}
          className={cn(
            "fixed top-[72px] right-0 h-screen w-64 p-6",
            "flex flex-col space-y-6",
            theme === 'dark' ? 'bg-black' : 'bg-white',
            !isMobileMenuOpen && "pointer-events-none"
          )}
        >
          <div className="flex items-center space-x-2">
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm">Theme</span>
          </div>

          {user ? (
            <div className="flex flex-col space-y-4">
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
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={() => {
                  handleAuthClick('login');
                  setIsMobileMenuOpen(false);
                }}
                variant="ghost"
              >
                Login
              </Button>
              <Button 
                onClick={() => {
                  handleAuthClick('signup');
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </motion.div>
      </motion.header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />
    </>
  );
}
