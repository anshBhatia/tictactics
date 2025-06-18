const cron = require('node-cron');
const axios = require('axios');

// Replace this with your Render server URL
const SERVER_URL = process.env.SERVER_URL || 'https://tictactics-server.onrender.com';

// Function to ping the server
const pingServer = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/health`);
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