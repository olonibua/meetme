# Remote Meetup App

A location-based meetup application built with Next.js that helps users create and join local meetups. The app ensures participants are within reasonable distance and provides real-time location tracking.

## Key Features

- 🔐 **Secure Authentication**
  - Email/password signup and login via Appwrite
  - Protected routes and sessions

- 📍 **Location-Based Features**
  - Automatic location detection
  - Distance-based meetup filtering
  - Location verification for participants
  - Warning system for out-of-area joins

- 🗺️ **Interactive Maps**
  - Visual meetup locations
  - Location picker for meetup creation
  - Real-time distance calculation
  - Mapbox integration

- 💬 **Real-time Communication**
  - Chat functionality for meetup participants
  - Participant management
  - Creator controls

- 🎨 **Modern UI/UX**
  - Dark/Light theme support
  - Responsive design
  - Smooth animations
  - Loading states

## Tech Stack

- **Frontend**
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Framer Motion
  - Mapbox GL JS

- **Backend**
  - Appwrite (Authentication & Database)
  - Mapbox (Geocoding)

## Getting Started

### Prerequisites
- Node.js 16+
- Appwrite instance
- Mapbox account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/remote-meetup-app.git
cd remote-meetup-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with required variables:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_PUBLIC_APPWRITE_MEETUPS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_MEETUPS_PARTICIPANTS_ID=
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

4. Start development server:
```bash
npm run dev
```

## Appwrite Setup

### Collections Required

1. **Meetups Collection**
   - title (string)
   - description (string)
   - location (string)
   - time (string)
   - lat (float)
   - lng (float)
   - maxParticipants (integer)
   - category (string)
   - requirements (string)
   - creatorId (string)
   - status (string)

2. **Participants Collection**
   - meetId (string)
   - userId (string)
   - joinedAt (string)
   - distance (float)
   - lat (float)
   - lng (float)
   - address (string)

3. **Messages Collection**
   - meetupId (string)
   - userId (string)
   - message (string)
   - timestamp (string)

## Usage

1. **Create a Meetup**
   - Set title and description
   - Pick location on map
   - Set date and time
   - Specify requirements
   - Choose category
   - Set max participants

2. **Join a Meetup**
   - Browse nearby meetups
   - View meetup details
   - Check distance
   - Request to join
   - Chat with participants

3. **Manage Meetups**
   - Track participants
   - Monitor distances
   - Remove out-of-area participants
   - Moderate chat

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open pull request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Appwrite](https://appwrite.io/)
- [Mapbox](https://www.mapbox.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
