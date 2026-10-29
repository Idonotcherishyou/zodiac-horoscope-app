
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

// Allow requests from our React frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));


// Allow the server to process JSON
app.use(express.json());

const axios = require('axios');

app.get('/api/horoscopes', async (req, res) => {
  try {
    const response = await axios.get(
      'https://multilingual-ai-zodiac-customized-horoscopes-for-all-signs.p.rapidapi.com/horoscope-all.php',
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host':
            'multilingual-ai-zodiac-customized-horoscopes-for-all-signs.p.rapidapi.com'
        },
        params: {
          date: new Date().toLocaleDateString('en-CA'),
          mode: 'serious',
          period: 'day',
          notes: '',
          lang: 'English'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
   console.error('Horoscope API error:', {
  status: error.response?.status,
  data: error.response?.data,
  message: error.message
});
    res.status(500).json({
      error: 'Unable to fetch horoscopes'
    });
  }
});


// Test endpoint
app.get('/', (req, res) => {
  res.send('Zodiac API server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
