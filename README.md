# Price-Tracker-

Price Tracker is a chrome extension which tracks the prices for Amazon products.

## Features

📈 Price history

📉 24 hour tracking

🔔 Price drop notifications

## Usage

![alt text](https://github.com/aarav87/Price-Tracker-/blob/master/readme.jpg?raw=true)

## How To Use

1. Clone the repo

        $ git clone https://github.com/Aarav87/Price-Tracker-.git

2. Install dependencies

        $ npm install

3. Create a firestore database and copy the Firebase configuration

4. Create a .env file and paste your Firebase configuration keys

        REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
        REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
        REACT_APP_FIREBASE_DATABASE_URL=YOUR_FIREBASE_DATABASE_URL
        REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
        REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
        REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID

5. Add backend URL in .env file

        REACT_APP_BACKEND_URL=http://localhost:3000

6. Generate a new "Private Key" from Service Account in Firebase Project Settings

7. Create a .env file inside the backend folder and paste your "Private Key"

        AUTH_PROVIDER=YOUR_AUTH_PROVIDER
        AUTH_URI=YOUR_AUTH_URI
        CERT_URL=YOUR_CERT_URL
        CLIENT_ID=YOUR_CLIENT_ID
        CLIENT_EMAIL=YOUR_CLIENT_EMAIL
        PRIVATE_KEY=YOUR_PRIVATE_KEY
        PRIVATE_KEY_ID=YOUR_PRIVATE_KEY_ID
        PROJECT_ID=YOUR_PROJECT_ID
        TOKEN_URI=YOUR_TOKEN_URI
        TYPE=service_account

8. Add Google email and password in backend .env file

        EMAIL=YOUR_EMAIL
        PASSWORD=YOUR_PASSWORD

9. Create a build folder

        $ npm run build

10. Go to chrome://extensions/ and click "Load Unpacked". Select and upload build folder at Price-Tracker/Build

11. Run backend

        $ node server.js

