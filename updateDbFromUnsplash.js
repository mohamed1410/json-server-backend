require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Path to your db.json file
const DB_PATH = path.join(__dirname, 'db.json');

// Function to fetch plant images from Unsplash
const fetchPlantsFromUnsplash = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: 'plants',
                per_page: 10 // Adjust the number as needed
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });
        return response.data.results.map(photo => ({
            id: photo.id,
            name: photo.alt_description || 'A beautiful plant',
            image: photo.urls.small,
            // Add other fields as needed
            price: Math.round(Math.random() * (100 - 10) + 10)
        }));
    } catch (error) {
        console.error('Error fetching data from Unsplash:', error);
        return [];
    }
};

// Function to update db.json with new plant data
const updateDbWithPlants = async (plantsData) => {
    // Read the current content of db.json
    const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
    // Assuming you have a "plants" array in your db.json
    dbContent.plants = [...dbContent.plants, ...plantsData];
    
    // Write the updated content back to db.json
    fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2), 'utf-8');
};

// Main function to fetch and update
const main = async () => {
    const plantsData = await fetchPlantsFromUnsplash();
    await updateDbWithPlants(plantsData);
    console.log('db.json has been updated with new plant data from Unsplash.');
};

main();