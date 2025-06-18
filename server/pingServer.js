const cron = require('node-cron');
const axios = require('axios');

// Replace this with your actual deployed URL
const SERVER_URL = process.env.SERVER_URL || 'https://tictactixx.netlify.app';

// Function to ping the server
const pingServer = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/health`);
    console.log(`Server pinged successfully at ${new Date().toISOString()}`);
    console.log('Server response:', response.data);
  } catch (error) {
    console.error('Error pinging server:', error.message);
    console.error('Full error:', error.response?.data || error);
  }
};

// Schedule the ping every 14 minutes
cron.schedule('*/14 * * * *', () => {
  console.log('Running scheduled ping...');
  pingServer();
});

// Initial ping when the script starts
pingServer();

console.log('Ping service started. Will ping server every 14 minutes.'); 