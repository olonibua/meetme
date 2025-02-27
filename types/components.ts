import { User } from './user';
import { Meetup } from './meetup';
import { MeetupLocation } from './meetup';

export interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export interface MapViewProps {
  userLocation: {
    lat: number;
    lng: number;
  } | null;
  meetups: Meetup[];
}

export interface MeetupCardProps {
  meetup: Meetup;
  user: User;
  userLocation: MeetupLocation | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
} 