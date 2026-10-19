import { useEffect, useState } from 'react';
import { useLanguage } from './useLanguage.js';
import { Header } from './Header';
import { Search } from './components/Search';
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';
import { appwriteData } from './appwrite';

const locales = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', de: 'de-DE', nl: 'nl-NL' };
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieExplorer() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchTerm.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (!apiKey) {
          setError('La démonstration nécessite une clé API TMDB configurée.');
          setMovies([]);
          return;
        }
        const url = new URL(`https://api.themoviedb.org/3/${query ? 'search/movie' : 'discover/movie'}`);
        url.searchParams.set('language', locales[language]);
        if (query) url.searchParams.set('query', query);
        else url.searchParams.set('sort_by', 'popularity.desc');
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { accept: 'application/json', Authorization: `Bearer ${apiKey}` },
        });
        if (!response.ok) throw new Error(`TMDB HTTP ${response.status}`);
        const data = await response.json();
        if (controller.signal.aborted) return;
        const results = data.results ?? [];
        setMovies(results);
        if (!results.length) setError('Aucun film trouvé. Essayez une autre recherche.');
        if (query && results.length) void appwriteData(query, results[0]);
      } catch (failure) {
        if (failure.name === 'AbortError') return;
        setError('Impossible de charger les films. Réessayez dans un instant.');
        setMovies([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [query, language]);

  return <>
    <Header/>
    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
    <section className="all-movies" aria-busy={loading} aria-live="polite">
      {loading ? <div className="demo-loading" role="status" aria-label={t('Chargement de la démonstration…')}><Spinner/></div>
        : error ? <p className="demo-message" role="status">{t(error)}</p>
          : <ul>{movies.map(movie => <MovieCard key={movie.id} movie={movie}/>)}</ul>}
    </section>
  </>;
}
