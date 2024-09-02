const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/getTimeStories', async (req, res) => {
    const targetUrl = 'https://time.com';

    try {
        
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;

        
        const stories = [];
        let currentIndex = 0;

        for (let i = 0; i < 6; i++) {
           
            const storyStart = html.indexOf('<h3 class="latest-stories__item-headline">', currentIndex);
            if (storyStart === -1) break;

            
            const linkStart = html.indexOf('<a href="', storyStart) + 9; 
            const linkEnd = html.indexOf('"', linkStart);
            const storyLink = html.substring(linkStart, linkEnd);

            
            const titleStart = html.indexOf('>', linkStart) + 1;
            const titleEnd = html.indexOf('</a>', titleStart);
            const storyTitle = html.substring(titleStart, titleEnd).trim();

          
            const fullUrl = `https://time.com${storyLink}`;

            stories.push({
                title: storyTitle,
                link: fullUrl,
            });

             currentIndex = titleEnd;
        }

          res.json(stories);

    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/getTimeStories`);
});
