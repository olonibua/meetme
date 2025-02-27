import { Models } from 'appwrite';

export interface Meetup extends Models.Document {
  title: string;
  location: string;
  time: string;
  creatorId: string;
  lat: number;
  lng: number;
}

export interface NewMeetup {
  title: string;
  location: string;
  time: string;
  description: string;
  maxParticipants: number;
  category: string;
  requirements: string;
}

export interface Meetup extends NewMeetup {
  $id: string;
  $createdAt: string;
  creatorId: string;
  lat: number;
  lng: number;
}

export interface MeetupLocation {
  lat: number;
  lng: number;
  address: string;
} 