"use client";
import { useState } from "react";
import { ID } from 'appwrite';
import { account, databases, DB_ID, USERS_COLLECTION_ID } from "../lib/appwrite";
import { useTheme } from "../lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (view === 'signup') {
        const user = await account.create(ID.unique(), email, password, name);
        await databases.createDocument(DB_ID, USERS_COLLECTION_ID, ID.unique(), {
          userId: user.$id,
          name,
          email,
        });
        toast.success('Account created successfully!');
      }
      await account.createEmailPasswordSession(email, password);
      toast.success('Logged in successfully!');
      window.location.href = "/";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`${view === 'login' ? 'Login' : 'Signup'} failed: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
        <DialogHeader>
          <DialogTitle>{view === 'login' ? 'Login' : 'Create Account'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}
            />
          )}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}
          />
          <div className="space-y-2">
            <Button type="submit" className="w-full">
              {view === 'login' ? 'Login' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
            >
              {view === 'login' ? 'Create Account' : 'Already have an account?'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 