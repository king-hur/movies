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

      const result = await response.json();
      console.log(result);
      if (result.Response === 'True') {
        setResults(result.Search);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className='text-4xl'>King and Jenny&lsquo;s Movie List</h1>
      <form onSubmit={getResults}>
        <input type='text' name='searchField' />
        <button type='submit'>Search</button>
      </form>

      <div>Results for: {search}</div>

      <table>
        <thead>
          <tr>
            <th>Movies</th>
            <th>Year</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr key={index}>
              <td><a href={`https://www.imdb.com/title/${item.imdbID}`}>{item.Title}</a></td>
              <td>{item.Year}</td>
              <td><img src={item.Poster} /></td>
              
              
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
