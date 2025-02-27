import { NextResponse } from 'next/server';
import { databases, DB_ID, MEETUPS_COLLECTION_ID } from "../../../lib/appwrite";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const meetups = await databases.listDocuments(DB_ID, MEETUPS_COLLECTION_ID);
    return NextResponse.json(meetups.documents);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
