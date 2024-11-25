import { useState } from 'react';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [bookResults, setBookResults] = useState([]);

  const submitHandler = (e) => {
    if (e.target.mediaType.value === 'movie') getMovieResults(e);
    else getBookResults(e);
  };

  const getMovieResults = async (e) => {
    e.preventDefault();
    const searchVal = e.target.searchField.value;
    setSearch(searchVal);

    const url = `https://movie-database-alternative.p.rapidapi.com/?s=${encodeURI(
      searchVal
    )}&r=json&page=1`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_MOVIE_RAPIDAPI_KEY,
        'x-rapidapi-host': import.meta.env.VITE_MOVIE_RAPIDAPI_HOST,
      },
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error('There was an error with fetching the data');

      const data = await response.json();
      const result = data.Search.filter((el) => el.Type === 'movie');
      console.log(result);
      if (result.length > 0) {
        setBookResults([]);
        setMovieResults(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBookResults = async (e) => {
    e.preventDefault();
    const searchVal = e.target.searchField.value;
    setSearch(searchVal);
    const GOOGLEAPI_KEY = import.meta.env.VITE_BOOK_GOOGLEAPI_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchVal}&key=${GOOGLEAPI_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      if (data.items.length > 0) {
        setMovieResults([]);
        setBookResults(data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col text-center min-h-screen w-full bg-slate-100'>
      <h1 className='text-6xl tracking-wide mt-10 font-bold bg-gradient-to-r from-blue-500 to-purple-500 inline-block text-transparent bg-clip-text leading-relaxed'>
        King and Jenny&lsquo;s Movie Vault
      </h1>
      <form onSubmit={submitHandler}>
        <input
          type='text'
          name='searchField'
          className='w-1/2 px-6 py-2 m-8 border-solid border-2'
        />
        <select name='mediaType'>
          <option value='movie'>Movies</option>
          <option value='books'>Books</option>
        </select>
        <button
          type='submit'
          className='bg-gradient-to-r from-blue-500 to-purple-500 font-semibold rounded p-1'
        >
          <span className='flex w-full px-6 py-2  bg-slate-100 rounded'>
            Search
          </span>
        </button>
      </form>

      <div>Results for: {search}</div>

      {/* create a ternary to display depending on if it's moves or result */}
      {movieResults.length > 0 && (
        <table className='m-20'>
          <thead>
            <tr>
              <th className='min-w-[300px]'></th>
              <th className='min-w-[300px]'>Movies</th>
              <th className='min-w-[300px]'>Year</th>
            </tr>
          </thead>

          <tbody>
            {movieResults.map((item, index) => (
              <tr key={index}>
                <td className=''>
                  <img className='float-right' src={item.Poster} />
                </td>
                <td>
                  <a href={`https://www.imdb.com/title/${item.imdbID}`}>
                    {item.Title}
                  </a>
                </td>
                <td>{item.Year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {bookResults.length > 0 && (
        <table className='m-20'>
          <thead>
            <tr>
              <th className='min-w-[300px]'></th>
              <th className='min-w-[300px]'>Title</th>
              <th className='min-w-[300px]'>Authors</th>
            </tr>
          </thead>

          <tbody>
            {bookResults.map((item, index) => (
              <tr key={index}>
                <td className=''>
                  <img
                    className='float-right'
                    src={item.volumeInfo.imageLinks.thumbnail}
                  />
                </td>
                <td>
                  <a href={`${item.volumeInfo.previewLink}`}>
                    {item.volumeInfo.title}
                  </a>
                </td>
                <td>{item.volumeInfo.authors.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
