"use client";
import { useEffect, useState, use } from 'react';
import { databases, DB_ID, MEETUPS_COLLECTION_ID, account, MEETUPS_PARTICIPANTS_ID } from '../../../lib/appwrite';
import { Meetup, MeetupLocation } from '../../../types/meetup';
import { User } from '../../../types/user';
import ChatSection from '@/components/ChatSection';
import { motion } from 'framer-motion';
import { useTheme } from '../../../lib/theme';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Query } from 'appwrite';
import { Models } from 'appwrite';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Participant extends Models.Document {
  userId: string;
  meetId: string;
  joinedAt: string;
  distance: number;
  name: string;
  location: MeetupLocation;
}

export default function MeetupDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { theme } = useTheme();
  const router = useRouter();
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetupData, userData, participantsData] = await Promise.all([
          databases.getDocument(DB_ID, MEETUPS_COLLECTION_ID, resolvedParams.id),
          account.get(),
          databases.listDocuments(DB_ID, MEETUPS_PARTICIPANTS_ID, [
            Query.equal('meetId', resolvedParams.id)
          ])
        ]);

        setMeetup(meetupData as Meetup);
        setUser(userData as User);
        setParticipants(participantsData.documents as Participant[]);
        setIsCreator(meetupData.creatorId === userData.$id);
      } catch  {
        console.error('Failed to fetch data:');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleRemoveParticipant = async (participantId: string) => {
    if (!isCreator) return;
    
    try {
      await databases.deleteDocument(DB_ID, MEETUPS_PARTICIPANTS_ID, participantId);
      setParticipants(participants.filter(p => p.$id !== participantId));
    } catch  {
      console.error('Failed to remove participant:');
    }
  };

  const handleDeleteMeetup = async () => {
    if (!isCreator || !meetup) return;

    try {
      await databases.deleteDocument(DB_ID, MEETUPS_COLLECTION_ID, meetup.$id);
      toast.success("Meetup deleted successfully!");
      router.push('/'); // Redirect to the home page or meetups list
    } catch  {
      const errorMessage = 'Unknown error';
      toast.error("Failed to delete meetup: " + errorMessage);
    }
  };

  if (loading)
    return (
      <div
        className={cn(
          "min-h-screen p-4",
          theme === "dark" ? "bg-gray-900" : "bg-white"
        )}
      >
        <div className="container mx-auto space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </div>
    );

  if (!meetup || !user) return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    )}>
      <p className="text-xl">Meetup not found</p>
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen pb-8",
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className={cn(
              "mb-4",
              theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-200'
            )}
          >
            ← Back to Meetups
          </Button>

          {isCreator && (
            <Button
              variant="destructive"
              onClick={handleDeleteMeetup}
              className="mb-4"
            >
              Delete Meetup
            </Button>
          )}

          <Card className={cn(
            "shadow-lg",
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
          )}>
            <CardHeader>
              <CardTitle className="text-3xl">{meetup.title}</CardTitle>
              <CardDescription className={cn(
                "space-y-2 mt-2",
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
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  <span>{participants.length} participants</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-lg",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                )}>
                  <h3 className="font-semibold mb-2">Participants</h3>
                  <div className="space-y-4">
                    {participants.map((participant) => (
                      <div key={participant.$id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${participant.userId}`} />
                            <AvatarFallback>{participant.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{participant.name}</p>
                            <p className="text-sm text-gray-500">
                              {participant.distance != null ? (
                                participant.distance > 50 ? 
                                  `⚠️ ${participant.distance.toFixed(1)} km away` : 
                                  `${participant.distance.toFixed(1)} km away`
                              ) : 'Distance unknown'}
                            </p>
                          </div>
                        </div>
                        {isCreator && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant.$id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "shadow-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          )}>
            <CardContent className="pt-6">
              <ChatSection meetupId={meetup.$id} user={user} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 