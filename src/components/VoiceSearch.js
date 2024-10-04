import React, { useState, useEffect, useCallback, useRef } from "react";

const VoiceSearch = ({ onSearch, language = "en-US" }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

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
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setSearchInput(finalTranscript || interimTranscript);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Speak or type your query..."
          style={{ flexGrow: 1, padding: '0.5rem' }}
        />
        <button onClick={toggleListening} style={{ padding: '0.5rem' }}>
          {isListening ? "Stop" : "Start"} Listening
        </button>
        <button onClick={handleSearch} style={{ padding: '0.5rem' }}>
          Search
        </button>
      </div>
      {status && <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{status}</p>}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '0.25rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;