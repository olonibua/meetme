"use client"; // Client component for interactivity
import { motion } from 'framer-motion';
import { useTheme } from '../lib/theme';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Meetup</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`
            fixed inset-0 z-50 flex items-center p-10 justify-center bg-black/50
          `}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              rounded-xl shadow-lg w-full max-w-md mx-4
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            {children}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
