# 🤟 Modern React Sign Language Translator

A clean, minimal React frontend connected to your Flask backend.

## ✨ What You Get

- **Modern UI**: Beautiful gradient design with Tailwind CSS
- **Simple Interface**: Just an input field and translate button
- **Animated Avatar**: CWASA player shows sign language animations
- **Real-time Translation**: Instant conversion from English to ISL

## 🚀 Quick Start

### Option 1: Automatic Start (Recommended)

```bash
./start.sh
```

This will:
- Start Flask backend on port 5001
- Start React frontend on port 3000
- Open both in the background

Then visit: **http://localhost:3000**

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
source .venv/bin/activate
export JAVA_HOME=$(/usr/libexec/java_home)
python -u main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then visit: **http://localhost:3000**

## 📁 What Was Created

```
text_to_isl/
├── frontend/                    # NEW React app
│   ├── src/
│   │   ├── App.jsx             # Main component (clean UI)
│   │   ├── main.jsx            # React entry
│   │   └── index.css           # Tailwind + styles
│   ├── index.html              # HTML with CWASA scripts
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite config
│   └── tailwind.config.js      # Tailwind config
├── main.py                      # UPDATED with CORS
├── requirements.txt             # UPDATED with flask-cors
└── start.sh                     # NEW startup script
```

## 🎨 Features

### Clean Interface
- Single input field for English text
- One button: "Translate to Sign Language"
- No visible player controls (all hidden)
- Modern gradient background
- Responsive design

### Smart Translation
- Type English text
- Press Enter or click button
- Avatar shows each sign
- Current word highlighted
- ISL translation displayed

### User Experience
- Loading spinner while avatar initializes
- Progress indicator during translation
- Smooth animations
- Error handling
- Mobile-friendly

## 🛠 Customization

### Change Colors

Edit `frontend/src/App.jsx` line 73:
```jsx
className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-500"
```

### Change Avatar

Edit `frontend/src/App.jsx` line 17:
```javascript
"avsbsl": ["marc"],  // Options: luna, siggi, anna, marc, francoise
```

### Animation Speed

Edit `frontend/src/App.jsx` line 56:
```javascript
await delay(1500); // milliseconds between signs
```

### Port Numbers

**Frontend** - Edit `frontend/vite.config.js`:
```javascript
server: { port: 3000 }
```

**Backend** - Edit `main.py`:
```python
app.run(host='0.0.0.0', port=5001)
```

## 📊 How It Works

```
User Types "I love apples"
        ↓
React Frontend (POST request)
        ↓
Flask Backend (NLP processing)
        ├─ Stanza tokenization
        ├─ Stanford Parser reordering
        ├─ Stop word removal
        ├─ Lemmatization
        └─ Returns: {"1":"apple","2":"I","3":"love"}
        ↓
React Frontend (plays animations)
        ├─ apple.sigml → avatar signs "apple"
        ├─ I.sigml → avatar signs "I"
        └─ love.sigml → avatar signs "love"
```

## 🐛 Troubleshooting

**Avatar not showing:**
```bash
# Make sure Flask is running on port 5001
curl http://localhost:5001/static/js/allcsa.js
```

**CORS errors:**
```bash
# Reinstall flask-cors
source .venv/bin/activate
pip install flask-cors
```

**Frontend build errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.js
```

## 🎯 Next Steps

Want to customize further?

1. **Add voice input**: Use Web Speech API
2. **History feature**: Save translations
3. **Share results**: Generate shareable links
4. **More languages**: Add ASL, BSL support
5. **Mobile app**: Use React Native
6. **Better UI**: Add animations, themes

## 📝 Notes

- Flask backend must run BEFORE React frontend (frontend needs CWASA scripts from backend)
- CWASA library loads from backend static files
- All SIGML files are served from Flask static directory
- Avatar takes 2-3 seconds to initialize
- Translation happens sequentially (one sign at a time)

## 🎉 You're All Set!

Run `./start.sh` and visit http://localhost:3000

Type something like:
- "hello world"
- "I love apples"
- "good morning"

Watch the avatar sign!
