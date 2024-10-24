import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import axios from 'axios';

const LocationSearch = () => {
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState([]);
  const [fav, setFav] = useState<string[]>([]);

  const debounceSearch = useDebounce(search, 1000);

  useEffect(() => {
    const getPlaces = async () => {
      if (!debounceSearch) return;
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${debounceSearch}`);
        setPlaces(res.data);
      } catch (err) {
        
      }
    };

    getPlaces();
  }, [debounceSearch]);

  const addFav = (placeId: string) => {
    if (!fav.includes(placeId)) {
      const updatedFav = [...fav, placeId];
      setFav(updatedFav);
      localStorage.setItem('favorite', JSON.stringify(updatedFav));
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('favorite');
    if (saved) setFav(JSON.parse(saved));
  }, []);

  return (
    <div className="container">
      <div className="title">
        <h1>Location Search</h1>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for location"
        className="input-style"
      />
      <ul>
        {places.map((place: any) => (
          <li key={place.place_id}>
            {place.display_name}
            <button onClick={() => addFav(place.place_id)}>Add to Fav</button>
          </li>
        ))}
      </ul>
      <h3>Favorites</h3>
      <ul>
        {places
          .filter((place: any) => fav.includes(place.place_id))
          .map((place: any) => (
            <li key={place.place_id}>{place.display_name}</li>
          ))}
      </ul>
    </div>
  );
};

export default LocationSearch;
