import { ID } from 'appwrite';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { databases, DB_ID } from '../lib/appwrite';
import { MeetupCardProps } from '../types/components';
import { useTheme } from '../lib/theme';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon, ClipboardListIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { calculateDistance, getUserLocation } from '../lib/geolocation';

const MEETUPS_PARTICIPANTS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEETUPS_PARTICIPANTS_ID!;

export default function MeetupCard({ meetup, user, userLocation }: MeetupCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (userLocation) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        meetup.lat,
        meetup.lng
      );
      setDistance(dist);
    }
  }, [userLocation, meetup]);

  const handleJoin = async () => {
    try {
      if (!userLocation) {
        const confirmed = window.confirm(
          "Location access is required to join meetups. Please enable location access and try again."
        );
        if (confirmed) {
          // Prompt for location access again
          const newLocation = await getUserLocation();
          if (newLocation) {
            userLocation = newLocation;
          } else {
            return; // Exit if still no location
          }
        } else {
          return; // Exit if user declines
        }
      }

      const participantData = {
        meetId: meetup.$id,
        userId: user.$id,
        joinedAt: new Date().toISOString(),
        distance: distance || 0,
        lat: userLocation.lat,
        lng: userLocation.lng,
        address: userLocation.address
      };

      await databases.createDocument(
        DB_ID,
        MEETUPS_PARTICIPANTS_ID,
        ID.unique(),
        participantData
      );

      router.push(`/meetup/${meetup.$id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to join meetup: ' + errorMessage);
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
    )}>
      <CardHeader>
        <CardTitle className="text-xl">{meetup.title}</CardTitle>
        <CardDescription className={cn(
          "space-y-2",
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        )}>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{meetup.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(meetup.time).toLocaleString()}</span>
          </div>
          {distance && (
            <div className="flex items-center gap-2 mt-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{distance.toFixed(1)} km away</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Show {isExpanded ? 'Less' : 'More'} Details
            {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  <span className="capitalize">{meetup.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  <span>{meetup.maxParticipants} max participants</span>
                </div>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {meetup.description}
                </p>
                {meetup.requirements && (
                  <div className="flex items-start gap-2">
                    <ClipboardListIcon className="w-4 h-4 mt-1" />
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {meetup.requirements}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={handleJoin}
            className="w-full"
          >
            Join Meetup
          </Button>

          
        </div>
      </CardContent>
    </Card>
  );
}
