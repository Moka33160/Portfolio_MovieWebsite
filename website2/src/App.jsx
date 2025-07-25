import "./App.css";
import { Header } from "./Header";
import { Search } from "./components/Search";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import { MovieCard } from "./components/MovieCard";
import { useDebounce } from "react-use";
import { appwriteData } from "./appwrite";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTION = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [DebounceUse, setDebounceUse] = useState("");

  useDebounce(() => setDebounceUse(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION);

      console.log(response);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setMovieList([]);
        setErrorMessage(`${data.Error} , failed to fetch movies`);
        return;
      }

      setMovieList(data.results);
      console.log("Films récupérés:", data.results);
      if (query && data.results.length > 0) {
        await appwriteData(query, data.results[0]);
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      setErrorMessage(`Échec du chargement: ${error.message}`);
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(DebounceUse);
  }, [DebounceUse]);

  return (
    <>
      <Header></Header>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
      <br />
      <h2 className="mt-10"></h2>

      {/*
      affichage des messages de succés ou d'erreur suivant l'etat du site
      */}

      <section className="all-movies mt-20 ">
        {isLoading ? (
          <div className="mt-50 ml-150">
            <Spinner></Spinner>
          </div>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default App;
