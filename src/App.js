import logo from './logo.svg';
import './App.css';
import BinaryConverter from './components/BinaryConverter';
import VoiceSearch from './components/VoiceSearch';

function App() {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <BinaryConverter />
      <h1>Voice search</h1>
      <VoiceSearch onSearch={handleSearch}/>
    </div>
  );
}

export default App;
