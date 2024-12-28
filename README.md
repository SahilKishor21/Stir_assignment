# **Twitter Trends Scraper**

This project is a web scraping application that fetches the top 5 trending topics on Twitter using **Puppeteer** and stores the results in a **MongoDB** database. It also displays the scraped data on a web page with a simple frontend.

---

## **Features**
- Scrapes Twitter's "What’s Happening" section for trending topics.
- Uses **ProxyMesh** for proxy-based requests.
- Saves the results in **MongoDB**, including:
  - Top 5 trending topics.
  - The IP address used for the request.
  - Timestamp of the scraping event.
- Displays the scraped data on a web page.

---

## **Tech Stack**
- **Frontend**: HTML, CSS, JavaScript.
- **Backend**: Node.js, Express, Puppeteer.
- **Database**: MongoDB.

---

## **Project Setup**

### **1. Prerequisites**
- Install **Node.js** (version 14.x or later).
- Install **MongoDB** (local or use MongoDB Atlas).
- Set up a **ProxyMesh** account for proxy access.

### **2. Clone the Repository**
```bash
git clone <repository_url>
cd <repository_name>

### **3. Install Dependencies**
```bash
npm install

### **4. Configure Environment Variables**
Create a `.env` file in the project root with the following content:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
PROXY_USER=your_proxymesh_username
PROXY_PASS=your_proxymesh_password
TWITTER_EMAIL=your_twitter_email
TWITTER_PASSWORD=your_twitter_password
PORT=3000
