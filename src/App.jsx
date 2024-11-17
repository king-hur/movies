import { useState } from 'react';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const getResults = async (e) => {
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
        setResults(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col text-center min-h-screen w-full bg-slate-100'>
      <h1 className='text-6xl tracking-wide mt-10 font-bold bg-gradient-to-r from-blue-500 to-purple-500 inline-block text-transparent bg-clip-text leading-relaxed'>
        King and Jenny&lsquo;s Movie Vault
      </h1>
      <form onSubmit={getResults}>
        <input
          type='text'
          name='searchField'
          className='w-1/2 px-6 py-2 m-8 border-solid border-2'
        />
        <button 
        type='submit'
        className='bg-gradient-to-r from-blue-500 to-purple-500 font-semibold rounded p-1'>
          <span className='flex w-full px-6 py-2  bg-slate-100 rounded'>
            Search
          </span>
        </button>
      </form>

      <div>Results for: {search}</div>

      <table className='m-20'>
        {results.length > 0 && (
          <thead>
            <tr>
              <th className='min-w-[300px]'></th>
              <th className='min-w-[300px]'>Movies</th>
              <th className='min-w-[300px]'>Year</th>
            </tr>
          </thead>
        )}
        <tbody>
          {results.map((item, index) => (
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
    </div>
  );
}

export default App;
