import React, { useState, useEffect, useCallback, useRef } from "react";

const VoiceSearch = ({ onSearch, initialLanguage = "en-US" }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(initialLanguage);
  const [confidence, setConfidence] = useState(0);
  const [interimResult, setInterimResult] = useState("");

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const languageOptions = [
    { code: "en-US", name: "English (US)" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "fr-FR", name: "French (France)" },
    { code: "de-DE", name: "German (Germany)" },
    { code: "it-IT", name: "Italian (Italy)" },
    { code: "ja-JP", name: "Japanese (Japan)" },
  ];

  const initializeRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech Recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onstart = () => {
      setStatus("Listening...");
      setIsListening(true);
      isRecognizingRef.current = true;
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setConfidence(Math.round(confidence * 100));
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setSearchInput(finalTranscript);
        setInterimResult("");
        handleVoiceCommands(finalTranscript);
      } else {
        setInterimResult(interimTranscript);
      }
    };

    recognitionRef.current.onspeechend = () => {
      setStatus("Processing...");
      stopListening();
    };

    recognitionRef.current.onerror = (event) => {
      setError(`Error occurred: ${event.error}`);
      stopListening();
    };
  }, [language]);

  useEffect(() => {
    initializeRecognition();
    return () => {
      stopListening();
    };
  }, [initializeRecognition]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not initialized.");
      return;
    }

    if (isRecognizingRef.current) {
      console.warn("Recognition is already running.");
      return;
    }

    try {
      recognitionRef.current.start();
      setStatus("Listening for your speech...");
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setError(`Failed to start listening: ${error.message}`);
      stopListening();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Failed to stop recognition:", error);
      }
    }
    setStatus("Stopped listening.");
    setIsListening(false);
    isRecognizingRef.current = false;
    setInterimResult("");
  }, []);

  const toggleListening = useCallback(() => {
    if (isRecognizingRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  const handleSearch = useCallback(() => {
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  }, [searchInput, onSearch]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setError(null);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleVoiceCommands = (transcript) => {
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes("clear")) {
      setSearchInput("");
      setStatus("Cleared input");
    } else if (lowerTranscript.includes("search")) {
      handleSearch();
    }
  };

  // CSS for the animated microphone
  const styles = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes wave {
      0% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
      100% { transform: translateY(0); }
    }
    .microphone-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
      margin-right: 5px;
    }
    .listening .microphone-icon {
      animation: pulse 1.5s infinite, wave 0.5s infinite;
    }
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: 'auto' }}>
      <style>{styles}</style>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Speak or type your query..."
          style={{ flexGrow: 1, padding: '0.5rem' }}
        />
        <button 
          onClick={toggleListening} 
          style={{ 
            padding: '0.5rem', 
            backgroundColor: isListening ? '#f87171' : '#60a5fa', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className={isListening ? 'listening' : ''}
        >
          <svg className="microphone-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93V9h2v-.07c0 2.76 2.24 5 5 5s5-2.24 5-5V9h2v-.07c0 4.08-3.06 7.44-7 7.93V19h-2v-3.07z"/>
          </svg>
          {isListening ? "Stop" : "Start"} Listening
        </button>
        <button onClick={handleSearch} style={{ padding: '0.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem' }}>
          Search
        </button>
      </div>
      {interimResult && (
        <div style={{ backgroundColor: '#e5e7eb', padding: '0.5rem', borderRadius: '0.25rem' }}>
          Hearing: {interimResult}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <select value={language} onChange={handleLanguageChange} style={{ padding: '0.5rem' }}>
          {languageOptions.map(option => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
        <div>
          Confidence: 
          <div style={{ width: '100px', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '10px', overflow: 'hidden', display: 'inline-block', marginLeft: '0.5rem' }}>
            <div style={{ width: `${confidence}%`, height: '100%', backgroundColor: '#10b981' }}></div>
          </div>
        </div>
      </div>
      {status && <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{status}</p>}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '0.25rem' }}>
          {error}
        </div>
      )}
      <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
        <strong>Voice Commands:</strong>
        <ul>
          <li>"Clear" - Clears the input</li>
          <li>"Search" - Performs the search</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceSearch;