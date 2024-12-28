const express = require('express');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Setup
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, 
    tlsAllowInvalidCertificates: false, 
});
const dbName = 'stir_assignment';

async function saveToDatabase(record) {
    try {
        const db = client.db(dbName);
        const collection = db.collection('twitter_trends');
        await collection.insertOne(record);
    } catch (error) {
        console.error('Error saving to database:', error);
        throw error;
    }
}

async function scrapeTrends() {
    let browser;
    try {
      
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        
        await page.authenticate({
            username: process.env.PROXY_USER,
            password: process.env.PROXY_PASS,
        });

        // Navigate to Twitter and log in
        await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });
        await page.type('input[name="session[username_or_email]"]', process.env.TWITTER_EMAIL);
        await page.type('input[name="session[password]"]', process.env.TWITTER_PASSWORD);
        await page.click('div[data-testid="LoginForm_Login_Button"]');
        await page.waitForTimeout(5000);

       
        const trends = await page.$$eval(
            'div[aria-label="Timeline: Trending now"] span',
            elements => elements.slice(0, 5).map(el => el.textContent)
        );

      
        const ipAddress = await page.evaluate(() => window.location.hostname);

        // Create the record
        const record = {
            _id: uuidv4(),
            trend1: trends[0] || 'N/A',
            trend2: trends[1] || 'N/A',
            trend3: trends[2] || 'N/A',
            trend4: trends[3] || 'N/A',
            trend5: trends[4] || 'N/A',
            date_time: new Date().toISOString(),
            ip_address: ipAddress,
        };

      
        await saveToDatabase(record);
        return record;
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// API to Trigger Scraping Script
app.get('/run_script', async (req, res) => {
    try {
        const result = await scrapeTrends();
        res.json(result);
    } catch (error) {
        console.error('Error running the script:', error);
        res.status(500).json({ error: 'Failed to run the script' });
    }
});


app.listen(PORT, async () => {
    try {
        await client.connect();
        console.log(`Connected to MongoDB and server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
