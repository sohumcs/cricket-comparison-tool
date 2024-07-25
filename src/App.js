import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [firstPlayerData, setFirstPlayerData] = useState(null);
  const [secondPlayerData, setSecondPlayerData] = useState(null);
  const [firstPlayerMatches, setFirstPlayerMatches] = useState([]);
  const [secondPlayerMatches, setSecondPlayerMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleSecondNameChange = (e) => {
    setSecondName(e.target.value);
  };

  const fetchPlayerId = async (playerName) => {
    const apikey = '10c94664-e987-4e09-a796-7f43a90e24c8';
    try {
      const response = await axios.get(`https://api.cricapi.com/v1/players?apikey=${apikey}&search=${encodeURIComponent(playerName)}`);
      console.log(`Fetched player ID for ${playerName}:`, response.data);
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data[0].id;
      } else {
        throw new Error(`Player not found: ${playerName}`);
      }
    } catch (error) {
      console.error('Error fetching player ID:', error);
      throw error.response ? error.response.data : { message: 'Network Error' };
    }
  };

  const fetchPlayerData = async (playerId) => {
    const apikey = '10c94664-e987-4e09-a796-7f43a90e24c8';
    try {
      const response = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=${apikey}&offset=0&id=${playerId}`);
      console.log(`Fetched data for player ID ${playerId}:`, response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
      throw error.response ? error.response.data : { message: 'Network Error' };
    }
  };

  const fetchPlayerMatches = async () => {
    const apikey = '10c94664-e987-4e09-a796-7f43a90e24c8';
    try {
      const response = await axios.get(`https://api.cricapi.com/v1/series?apikey=${apikey}&offset=0`);
      console.log('Fetched series data:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching series data:', error);
      throw error.response ? error.response.data : { message: 'Network Error' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFirstPlayerData(null);
    setSecondPlayerData(null);
    setFirstPlayerMatches([]);
    setSecondPlayerMatches([]);

    try {
      const [firstPlayerId, secondPlayerId] = await Promise.all([
        fetchPlayerId(firstName),
        fetchPlayerId(secondName),
      ]);

      const [firstPlayerData, secondPlayerData] = await Promise.all([
        fetchPlayerData(firstPlayerId),
        fetchPlayerData(secondPlayerId),
      ]);

      const seriesData = await fetchPlayerMatches();

      setFirstPlayerData(firstPlayerData);
      setSecondPlayerData(secondPlayerData);
      setFirstPlayerMatches(seriesData);  // Assuming the series data might need filtering based on the player
      setSecondPlayerMatches(seriesData); // Assuming the series data might need filtering based on the player
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div class="social-links">
            <a href="https://www.instagram.com/sohumcs/" target="_blank" class="social-link">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="https://github.com/sohumcs" target="_blank" class="social-link">
                <i class="fab fa-github"></i>
            </a>
            <a href="https://leetcode.com/u/sohumcs/" target="_blank" class="social-link">
                <i class="fab fa-code"></i>
            </a>
        </div>
      <div className="title">
        <h1>CRICKET STATS COMPARISON TOOL</h1>
      </div>
      <div className="SearchBoxes">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search">
            <span className="search-icon material-symbols-outlined">search</span>
            <input
              className="search-input"
              type="search"
              placeholder="Enter First Player Name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </div>
          <div className="search">
            <span className="search-icon material-symbols-outlined">search</span>
            <input
              className="search-input"
              type="search"
              placeholder="Enter Second Player Name"
              value={secondName}
              onChange={handleSecondNameChange}
            />
          </div>
          <button type="submit" className="search-button">SEARCH</button>
        </form>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">Error: {error.message}</div>}
      <div className="results">
        {firstPlayerData && (
          <div className="player-data">
            <h2>{firstPlayerData.name}</h2>
            <p>Date of Birth: {firstPlayerData.dateOfBirth}</p>
            <p>Role: {firstPlayerData.role}</p>
            <p>Batting Style: {firstPlayerData.battingStyle}</p>
            <p>Bowling Style: {firstPlayerData.bowlingStyle}</p>
            <p>Place of Birth: {firstPlayerData.placeOfBirth}</p>
            <p>Country: {firstPlayerData.country}</p>
            <img src={firstPlayerData.playerImg} alt={`${firstPlayerData.name}`} />
            <h3>Matches:</h3>
            {firstPlayerMatches.length > 0 ? (
              <ul>
                {firstPlayerMatches.map((match, index) => (
                  <li key={index}>
                    <p>Name: {match.name}</p>
                    <p>Start Date: {match.startDate}</p>
                    <p>End Date: {match.endDate}</p>
                    <p>ODI: {match.odi ? 'Yes' : 'No'}</p>
                    <p>T20: {match.t20 ? 'Yes' : 'No'}</p>
                    <p>Test: {match.test ? 'Yes' : 'No'}</p>
                    <p>Squads: {Array.isArray(match.squads) ? match.squads.join(', ') : match.squads}</p>
                    <p>Matches: {match.matches}</p>
                    <hr />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No match data available</p>
            )}
          </div>
        )}
        {secondPlayerData && (
          <div className="player-data">
            <h2>{secondPlayerData.name}</h2>
            <p>Date of Birth: {secondPlayerData.dateOfBirth}</p>
            <p>Role: {secondPlayerData.role}</p>
            <p>Batting Style: {secondPlayerData.battingStyle}</p>
            <p>Bowling Style: {secondPlayerData.bowlingStyle}</p>
            <p>Place of Birth: {secondPlayerData.placeOfBirth}</p>
            <p>Country: {secondPlayerData.country}</p>
            <img src={secondPlayerData.playerImg} alt={`${secondPlayerData.name}`} />
            <h3>Matches:</h3>
            {secondPlayerMatches.length > 0 ? (
              <ul>
                {secondPlayerMatches.map((match, index) => (
                  <li key={index}>
                    <p>Name: {match.name}</p>
                    <p>Start Date: {match.startDate}</p>
                    <p>End Date: {match.endDate}</p>
                    <p>ODI: {match.odi ? 'Yes' : 'No'}</p>
                    <p>T20: {match.t20 ? 'Yes' : 'No'}</p>
                    <p>Test: {match.test ? 'Yes' : 'No'}</p>
                    <p>Squads: {Array.isArray(match.squads) ? match.squads.join(', ') : match.squads}</p>
                    <p>Matches: {match.matches}</p>
                    <hr />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No match data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
