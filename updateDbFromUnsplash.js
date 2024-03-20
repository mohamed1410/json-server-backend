require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');


const DB_PATH = path.join(__dirname, 'db.json');


const fetchPlantsFromUnsplash = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: 'plants',
                per_page: 10 
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });
        return response.data.results.map(photo => ({
            id: photo.id,
            name: photo.alt_description || 'A beautiful plant',
            image: photo.urls.small,
        
            price: Math.round(Math.random() * (100 - 10) + 10)
        }));
    } catch (error) {
        console.error('Error fetching data from Unsplash:', error);
        return [];
    }
};


const updateDbWithPlants = async (plantsData) => {
    
    const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
   
    dbContent.plants = [...dbContent.plants, ...plantsData];
    
   
    fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2), 'utf-8');
};


const main = async () => {
    const plantsData = await fetchPlantsFromUnsplash();
    await updateDbWithPlants(plantsData);
    console.log('db.json has been updated with new plant data from Unsplash.');
};

// main();