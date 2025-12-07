# Sign Language Translator - React Frontend

Modern, minimal React frontend for the Text to ISL translator.

## Features

✨ Clean, gradient UI with Tailwind CSS
🎭 Integrated CWASA avatar player
⚡ Real-time translation and animation
📱 Responsive design

## Setup & Run

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Backend (Flask)

In the project root directory:

```bash
# Activate virtual environment
source .venv/bin/activate

# Set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home)

# Install flask-cors if needed
pip install flask-cors

# Start Flask backend on port 5001
python -u main.py
```

Backend will run on: http://localhost:5001

### 3. Start the Frontend (React)

In a new terminal, from the `frontend` directory:

```bash
npm run dev
```

Frontend will run on: http://localhost:3000

### 4. Use the App

1. Open http://localhost:3000 in your browser
2. Wait for the avatar to load (2-3 seconds)
3. Type English text in the input field
4. Click "Translate to Sign Language" or press Enter
5. Watch the avatar perform the signs!

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind styles + CWASA overrides
├── index.html           # HTML template (includes CWASA scripts)
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## How It Works

1. User enters English text
2. React sends POST request to Flask backend (`http://localhost:5001/`)
3. Backend processes text:
   - Stanza NLP analysis
   - Stanford Parser reordering
   - Stop word removal
   - Lemmatization
   - ISL word mapping
4. Backend returns JSON: `{"1": "word1", "2": "word2", ...}`
5. React plays each SIGML animation sequentially
6. CWASA avatar displays the signs

## Customization

### Change Avatar
Edit `App.jsx` line 17:
```javascript
"avsbsl": ["luna", "siggi", "anna", "marc", "francoise"],
"initAv": "marc"  // Change to any avatar name
```

### Change Colors
Edit gradient in `App.jsx` line 73:
```jsx
className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
```

### Change Animation Speed
Edit delay in `App.jsx` line 56:
```javascript
await delay(2000); // Change from 2000ms (2 seconds) to your preference
```

## Troubleshooting

**Avatar not loading:**
- Make sure Flask backend is running on port 5001
- Check browser console for CORS errors
- Ensure CWASA scripts load from `http://localhost:5001/static/`

**Translation not working:**
- Verify Flask backend is running
- Check `flask-cors` is installed: `pip install flask-cors`
- Open browser dev tools (F12) to see network requests

**Port already in use:**
- Change React port in `vite.config.js` (default: 3000)
- Change Flask port in `main.py` (default: 5001)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **CWASA** - Sign language avatar player
- **Flask** - Backend API (in parent directory)

## Production Build

```bash
npm run build
```

Builds to `dist/` folder. Serve with any static file server.
