# UniWell - Your Online Nurse Companion

A web application providing instant health guidance, mental health support, and first aid resources tailored for university life.

## Features

- **Symptom Check**: Check symptoms instantly
- **Mental Health**: Emotional well-being support
- **Health Questions**: FAQ & Common Injuries
- **First Aid Guide**: Emergency response information

## Tech Stack

### Frontend
- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6+)
- Font Awesome & Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Groq API for AI assistance

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following:
```env
GROQ_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /` - Serve the main application
- `GET /api/test` - Test endpoint
- `POST /api/groq` - AI chat endpoint
- `GET /api/nurse-cases` - Fetch nurse cases
- `POST /api/webhook-ghl-sheet` - Webhook for case submission

## Admin Access

Default credentials:
- Username: `admin`
- Password: `1234`

*Note: For production use, please change these credentials!*

## Project Structure

```
.
├── api/
│   ├── index.js          # Main server file
│   ├── nurse-cases.js    # Nurse cases endpoint
│   ├── webhook-ghl-sheet.js   # Webhook endpoint
│   └── models/
│       └── Case.js       # Mongoose model
├── index.html            # Main HTML file
├── script.js             # Frontend JavaScript
├── style.css             # Custom CSS styles
├── package.json          # Project dependencies
└── .env                  # Environment variables (not committed)
```

## Development

To run the server in development mode (with hot reload):

```bash
npm run dev
```

## License

ISC