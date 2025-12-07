import { useState, useEffect, useRef } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [islText, setIslText] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading CWASA scripts...');
  const avatarInitialized = useRef(false);

  useEffect(() => {
    // Load CWASA CSS
    const loadCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'http://localhost:5001/static/css/cwasa.css';
      document.head.appendChild(link);
      setLoadingMessage('CSS loaded. Loading JavaScript...');
    };

    // Load CWASA JS
    const loadJS = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'http://localhost:5001/static/js/allcsa.js';
        script.type = 'text/javascript';
        script.onload = () => {
          setLoadingMessage('JavaScript loaded. Initializing avatar...');
          resolve();
        };
        script.onerror = () => {
          setLoadingMessage('Error loading CWASA. Is backend running on port 5001?');
          reject(new Error('Failed to load CWASA'));
        };
        document.body.appendChild(script);
      });
    };

    // Initialize CWASA
    const initCWASA = () => {
      const checkAndInit = () => {
        if (window.CWASA && !avatarInitialized.current) {
          try {
            const initCfg = {
              "cfgFilePath": "/cwacfg.json",
              "avsbsl": ["marc"],
              "avSettings": { 
                "avList": "avsbsl", 
                "initAv": "marc",
                "width": 600,
                "height": 500
              }
            };
            
            window.CWASA.init(initCfg);
            avatarInitialized.current = true;
            setLoadingMessage('Avatar initialized! Ready to translate.');
            
            setTimeout(() => {
              setAvatarReady(true);
            }, 3000);
          } catch (error) {
            console.error('Error initializing CWASA:', error);
            setLoadingMessage('Error initializing avatar: ' + error.message);
          }
        } else if (!window.CWASA) {
          setTimeout(checkAndInit, 500);
        }
      };
      
      checkAndInit();
    };

    // Load everything in sequence
    loadCSS();
    loadJS()
      .then(() => {
        setTimeout(initCWASA, 1000);
      })
      .catch(err => {
        console.error('Failed to load CWASA:', err);
      });
  }, []);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const translateToSign = async () => {
    if (!inputText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setCurrentWord('');
    setIslText('');

    try {
      const formData = new URLSearchParams();
      formData.append('text', inputText);

      const response = await fetch('http://localhost:5001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) throw new Error('Translation failed');

      const words = await response.json();
      const wordArray = Object.values(words);
      
      setIslText(wordArray.join(' '));

      // Play each sign animation
      for (let word of wordArray) {
        setCurrentWord(word);
        window.CWASA.playSiGMLURL(`http://localhost:5001/static/SignFiles/${word}.sigml`);
        await delay(2000); // Wait 2 seconds between signs
      }

      setCurrentWord('');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Error translating text. Make sure the Flask backend is running on port 5001.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTranslating) {
      translateToSign();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Sign Language Translator
          </h1>
          <p className="text-white/90 text-lg">
            Type in English, see it in Indian Sign Language
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Avatar Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-8">
            <div className="relative bg-gray-100 rounded-lg" style={{ minHeight: '500px' }}>
              {/* CWASA Avatar Container */}
              <div 
                className="CWASAAvatar av0 mx-auto" 
                style={{ 
                  width: '100%', 
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              ></div>
              
              {!avatarReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{loadingMessage}</p>
                    <p className="text-xs text-gray-400 mt-2">Make sure Flask backend is running on port 5001</p>
                  </div>
                </div>
              )}

              {/* Current Word Display */}
              {currentWord && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
                  <span className="text-2xl font-bold">{currentWord}</span>
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className="p-8 bg-white">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Enter English Text
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type something like 'I love apples'..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-lg"
                disabled={isTranslating}
              />
            </div>

            {/* Translate Button */}
            <button
              onClick={translateToSign}
              disabled={isTranslating || !inputText.trim() || !avatarReady}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform ${
                isTranslating || !inputText.trim() || !avatarReady
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isTranslating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </span>
              ) : !avatarReady ? (
                'Loading Avatar...'
              ) : (
                '✋ Translate to Sign Language'
              )}
            </button>

            {/* ISL Text Display */}
            {islText && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                <p className="text-sm font-semibold text-indigo-800 mb-1">ISL Translation:</p>
                <p className="text-xl text-indigo-900 font-medium">{islText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>Powered by Stanza NLP • Stanford Parser • CWASA Avatar</p>
        </div>
      </div>
    </div>
  );
}

export default App;
