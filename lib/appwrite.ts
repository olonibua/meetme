import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

export const account = new Account(client);
export const databases = new Databases(client);
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const MEETUPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MEETUPS_COLLECTION_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const MEETUPS_PARTICIPANTS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEETUPS_PARTICIPANTS_ID!;

export default client;
