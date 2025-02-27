import { databases, DB_ID, MEETUPS_COLLECTION_ID } from "../../../lib/appwrite";

export async function GET() {
  try {
    const meetups = await databases.listDocuments(DB_ID, MEETUPS_COLLECTION_ID);
    return new Response(JSON.stringify(meetups.documents), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
