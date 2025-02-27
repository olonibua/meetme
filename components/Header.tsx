"use client"; // Client component for interactivity
import { useRouter } from "next/navigation";
import { useTheme } from '../lib/theme';
import { motion } from 'framer-motion';
import { HeaderProps } from '../types/components';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
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
          <Button 
            onClick={() => router.push("/login")}
            className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}
          >
            Login
          </Button>
        )}
      </div>
    </motion.header>
  );
}
