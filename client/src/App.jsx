


import { useState, useEffect } from 'react';
import './App.css';

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

function App() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [horoscopes, setHoroscopes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHoroscopes() {
      try {
        const response = await fetch('http://localhost:5001/api/horoscopes');

        if (!response.ok) {
          throw new Error('Failed to fetch horoscopes');
        }

        const data = await response.json();
        console.log('Horoscope data:', data);
        setHoroscopes(data);
      } catch (err) {
        console.error(err);
        setError('Could not load horoscopes.');
      } finally {
        setLoading(false);
      }
    }

    fetchHoroscopes();
  }, []);

  // Find the horoscope for the selected zodiac sign.
  // This supports either an object keyed by sign or an array of signs.
  const entries = horoscopes?.horoscopes ?? horoscopes?.data ?? horoscopes;

  const selectedHoroscope = selectedSign
    ? Array.isArray(entries)
      ? entries.find(
          (item) =>
            String(item.sign ?? item.zodiac ?? '').toLowerCase() ===
            selectedSign.toLowerCase()
        )
      : entries?.[selectedSign] ??
        entries?.[selectedSign.toLowerCase()]
    : null;

  const horoscopeText =
    typeof selectedHoroscope === 'string'
      ? selectedHoroscope
      : selectedHoroscope?.horoscope ??
        selectedHoroscope?.text ??
        selectedHoroscope?.prediction ??
        null;

  return (
    <div className="app">
      <h1>✨ Zodiac Horoscope</h1>
      <p>Discover what the stars have in store for you.</p>

      <h2>Choose Your Zodiac Sign</h2>

      <div className="zodiac-grid">
        {zodiacSigns.map((sign) => (
          <button
            key={sign}
            onClick={() => setSelectedSign(sign)}
          >
            {sign}
          </button>
        ))}
      </div>

      {loading && <p>Loading horoscopes...</p>}
      {error && <p>{error}</p>}

      {selectedSign && (
        <div className="horoscope-result">
          <h2>Your Sign: {selectedSign}</h2>

          {!loading && !error && (
            horoscopeText ? (
              <p>{typeof horoscopeText === 'string'
                ? horoscopeText
                : JSON.stringify(horoscopeText)}</p>
            ) : (
              <p>Horoscope not found in the API response.</p>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default App;
