import React, { useState, useEffect } from 'react';

function Converter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('textToBinary'); 
  const [output, setOutput] = useState('');
  const [warning, setWarning] = useState('');

  
  const binaryToText = (binaryStr) => {
    let binaryArr = binaryStr.split(' ');
    let decodedText = binaryArr.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    return decodedText;
  };

  const textToBinary = (text) => {
    let binaryStr = text.split('')
                        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
                        .join(' ');
    return binaryStr;
  };

  const textToAscii = (text) => {
    let asciiStr = text.split('')
                       .map(char => char.charCodeAt(0))
                       .join(' ');
    return asciiStr;
  };

  const asciiToText = (asciiStr) => {
    let asciiArr = asciiStr.split(' ');
    let decodedText = asciiArr.map(ascii => String.fromCharCode(ascii)).join('');
    return decodedText;
  };

  const textToBase64 = (text) => {
    return btoa(text);
  };
  const base64ToText = (base64Str) => {
    try {
      return atob(base64Str);
    } catch (error) {
      setWarning("Invalid Base64 string. Unable to decode.");
      return "";
    }
  };

  const textToHex = (text) => {
    let hexStr = text.split('')
                     .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                     .join(' ');
    return hexStr;
  };

  const hexToText = (hexStr) => {
    let hexArr = hexStr.split(' ');
    let decodedText = hexArr.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    return decodedText;
  };

  useEffect(() => {
    setWarning('');
    let result;
    switch (mode) {
      case 'textToBinary':
        result = textToBinary(input);
        break;
      case 'binaryToText':
        result = binaryToText(input);
        break;
      case 'textToAscii':
        result = textToAscii(input);
        break;
      case 'asciiToText':
        result = asciiToText(input);
        break;
      case 'textToBase64':
        result = textToBase64(input);
        break;
      case 'base64ToText':
        result = base64ToText(input);
        break;
      case 'textToHex':
        result = textToHex(input);
        break;
      case 'hexToText':
        result = hexToText(input);
        break;
      default:
        result = input;
    }

    setOutput(result);
  }, [input, mode]); 

  const isSelected = (currentMode) => mode === currentMode ? { backgroundColor: '#007BFF', color: '#fff' } : {};

  return (
    <div>
      <h1>Multi-Format Converter</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input"
        rows={5}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <div>
        <button style={isSelected('textToBinary')} onClick={() => setMode('textToBinary')}>Text to Binary</button>
        <button style={isSelected('binaryToText')} onClick={() => setMode('binaryToText')}>Binary to Text</button>
        <button style={isSelected('textToAscii')} onClick={() => setMode('textToAscii')}>Text to ASCII</button>
        <button style={isSelected('asciiToText')} onClick={() => setMode('asciiToText')}>ASCII to Text</button>
        <button style={isSelected('textToBase64')} onClick={() => setMode('textToBase64')}>Text to Base64</button>
        <button style={isSelected('base64ToText')} onClick={() => setMode('base64ToText')}>Base64 to Text</button>
        <button style={isSelected('textToHex')} onClick={() => setMode('textToHex')}>Text to Hexadecimal</button>
        <button style={isSelected('hexToText')} onClick={() => setMode('hexToText')}>Hexadecimal to Text</button>
      </div>

      {warning && <p style={{ color: 'red' }}>{warning}</p>}

      <h2>Output:</h2>
      <textarea
        value={output}
        readOnly
        rows={5}
        style={{ width: '100%', marginTop: '10px' }}
      />
    </div>
  );
}

export default Converter;
