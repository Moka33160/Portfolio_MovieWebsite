import { Client, Databases, ID, Query } from 'appwrite';

const databaseId = import.meta.env.VITE_APPWRITE_DB_API_KEY;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_API_KEY;
const projectId = import.meta.env.VITE_APPWRITE_API_KEY;
const databases = projectId && databaseId && collectionId
  ? new Databases(new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(projectId))
  : null;

// Search analytics are optional and must never prevent displaying movie results.
export async function appwriteData(searchTerm, movie) {
  if (!databases) return;
  try {
    const result = await databases.listDocuments(databaseId, collectionId, [Query.equal('searchTerm', searchTerm)]);
    const document = result.documents[0];
    if (document) {
      await databases.updateDocument(databaseId, collectionId, document.$id, { count: document.count + 1 });
    } else {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
      });
    }
  } catch {
    // Appwrite may be unconfigured or unavailable; the TMDB demo remains usable.
  }
}
