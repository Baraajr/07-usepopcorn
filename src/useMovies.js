import { useEffect, useState } from 'react';

const apiKey = '49bb7f58';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      // callback?.();

      const controler = new AbortController();
      async function fetchMovies() {
        try {
          setIsloading(true);
          setError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controler.signal }
          );

          if (!res.ok)
            throw new Error('Something went wrong with fetching movies');

          const data = await res.json();

          if (data.Response === 'False') {
            throw new Error(data.Error);
          }
          setMovies(() => data.Search);
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsloading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      fetchMovies();

      return function () {
        controler.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
