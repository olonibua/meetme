"use client"; // Client component for state and interactivity
import { useState, useEffect } from "react";
import {
  account,
  databases,
  DB_ID,
  MEETUPS_COLLECTION_ID,
} from "../lib/appwrite";
import { getUserLocation, calculateDistance } from "../lib/geolocation";
import Header from "../components/Header";
import MeetupCard from "../components/MeetupCard";
import MapView from "../components/MapView";
import { User } from '../types/user';
import { Meetup, MeetupLocation, NewMeetup } from '../types/meetup';
import { useTheme } from '../lib/theme';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import AuthModal from "../components/AuthModal";
import { toast } from "sonner";
import LocationAutocomplete from "../components/LocationAutocomplete";

export default function Home() {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<MeetupLocation | null>(null);
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeetup, setNewMeetup] = useState<NewMeetup>({
    title: "",
    location: "",
    time: "",
    description: "",
    maxParticipants: 10,
    category: "social",
    requirements: "",
  });
  const [selectedLocation, setSelectedLocation] = useState<MeetupLocation | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(50); // 50km default radius
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get user data if logged in
        try {
          const userData = await account.get();
          setUser(userData);
        } catch{
          // User not logged in, continue without user data
          console.log("No user logged in");
        }

        // Get location and meetups regardless of auth status
        const loc = await getUserLocation();
        setLocation(loc);
        const meetupData = await databases.listDocuments(
          DB_ID,
          MEETUPS_COLLECTION_ID
        );

        const filteredMeetups = meetupData.documents.filter((doc) => {
          if (!loc) return true;
          const distance = calculateDistance(
            loc.lat,
            loc.lng,
            doc.lat,
            doc.lng
          );
          return distance <= maxDistance;
        });

        setMeetups(filteredMeetups as Meetup[]);
      } catch {
        console.error("Error fetching data:");
      }
    };

    fetchData();
  }, [maxDistance]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleCreateMeetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLocation) {
      toast.error("Please select a location on the map");
      return;
    }

    try {
      const meetupData = {
        title: newMeetup.title,
        description: newMeetup.description,
        location: selectedLocation.address,
        time: newMeetup.time,
        maxParticipants: newMeetup.maxParticipants,
        category: newMeetup.category,
        requirements: newMeetup.requirements,
        creatorId: user!.$id,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        participants: [], // Initialize empty participants array
        status: 'active', // Add status field
        createdAt: new Date().toISOString(),
      };

      const meetup = await databases.createDocument(
        DB_ID,
        MEETUPS_COLLECTION_ID,
        "unique()",
        meetupData
      );

      setMeetups([
        ...meetups,
        {
          ...meetup,
          ...meetupData,
        } as Meetup,
      ]);

      setIsModalOpen(false);
      setNewMeetup({
        title: "",
        location: "",
        time: "",
        description: "",
        maxParticipants: 10,
        category: "social",
        requirements: "",
      });
      setSelectedLocation(null);
      toast.success("Meetup created successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to create meetup: " + errorMessage);
    }
  };

  const handleCreateClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <Header user={user} onLogout={handleLogout} />
      <div className="container mx-auto p-4 pt-28">
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-2xl font-semibold",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            Nearby Meetups
          </motion.h2>
          <Button
            onClick={handleCreateClick}
            className={cn(
              theme === 'dark' ? 
                'bg-white hover:bg-white text-black' : 
                'bg-black hover:bg-black text-white'
            )}
          >
            Create Meetup
          </Button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Label>Maximum Distance (km)</Label>
          <Select 
            value={maxDistance.toString()}
            onValueChange={(value) => setMaxDistance(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
              <SelectItem value="100">100 km</SelectItem>
              <SelectItem value="9999">Any Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {meetups.map((meetup) => (
              <MeetupCard 
                key={meetup.$id} 
                meetup={meetup} 
                user={user!}
                userLocation={location}
              />
            ))}
          </div>
          <MapView userLocation={location} meetups={meetups} />
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={cn(
          "sm:max-w-[525px]",
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
        )}>
          <DialogHeader>
            <DialogTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Create a Meetup
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateMeetup} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                type="text"
                value={newMeetup.title}
                onChange={(e) => setNewMeetup({ ...newMeetup, title: e.target.value })}
                placeholder="Meetup Title"
                required
                className={cn(
                  theme === 'dark' ? 
                    'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 
                    'bg-white text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newMeetup.description}
                onChange={(e) => setNewMeetup({ ...newMeetup, description: e.target.value })}
                placeholder="Describe your meetup..."
                required
                className={cn(
                  theme === 'dark' ? 
                    'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 
                    'bg-white text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <LocationAutocomplete
                value={newMeetup.location}
                onChange={(location) => {
                  setNewMeetup({ ...newMeetup, location: location.address });
                  setSelectedLocation(location);
                }}
                className={cn(
                  theme === 'dark' ? 
                    'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 
                    'bg-white text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                value={newMeetup.time}
                onChange={(e) => setNewMeetup({ ...newMeetup, time: e.target.value })}
                required
                className={cn(
                  theme === 'dark' ? 
                    'bg-gray-700 text-white border-gray-600' : 
                    'bg-white text-gray-900'
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newMeetup.category}
                  onValueChange={(value) => setNewMeetup({ ...newMeetup, category: value })}
                >
                  <SelectTrigger className={cn(
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={newMeetup.maxParticipants}
                  onChange={(e) => setNewMeetup({ ...newMeetup, maxParticipants: parseInt(e.target.value) })}
                  min="1"
                  required
                  className={cn(
                    theme === 'dark' ? 
                      'bg-gray-700 text-white border-gray-600' : 
                      'bg-white text-gray-900'
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requirements</Label>
              <Textarea
                value={newMeetup.requirements}
                onChange={(e) => setNewMeetup({ ...newMeetup, requirements: e.target.value })}
                placeholder="Any specific requirements for participants..."
                className={cn(
                  theme === 'dark' ? 
                    'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 
                    'bg-white text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            <Button 
              type="submit"
              className={cn(
                "w-full",
                theme === 'dark' ? 
                  'bg-blue-600 hover:bg-blue-500' : 
                  'bg-blue-500 hover:bg-blue-600'
              )}
            >
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="login"
      />
    </div>
  );
}
