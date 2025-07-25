import { Client, Databases, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DB_API_KEY;
const DATABASE_COLLLECTION = import.meta.env.VITE_APPWRITE_COLLECTION_API_KEY;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_API_KEY;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const databases = new Databases(client);

export const appwriteData = async (searchTerm, movie) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      DATABASE_COLLLECTION,
      [Query.filter("search_term", searchTerm)]
    );

    if (result.documents.length > 0) {
      const doc = documents[0];

      await databases.updateDocument(
        DATABASE_ID,
        DATABASE_COLLLECTION,
        doc.$id,
        { count: doc.count + 1 }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        DATABASE_COLLLECTION,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};
