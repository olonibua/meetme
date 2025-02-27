"use client"; // Client component for form handling
import { useState } from "react";
import { ID } from 'appwrite';
import {
  account,
  databases,
  DB_ID,
  USERS_COLLECTION_ID,
} from "../../lib/appwrite";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await databases.createDocument(DB_ID, USERS_COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        name,
        email,
      });
      await account.createEmailPasswordSession(email, password);
      window.location.href = "/";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert("Signup failed: " + errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
