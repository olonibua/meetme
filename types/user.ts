import { Models } from 'appwrite';

export type User = Models.User<Models.Preferences>;

export interface UserDocument {
  userId: string;
  name: string;
  email: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
} 