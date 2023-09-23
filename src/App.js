import React, { useState } from 'react';
import './App.css';

function App() {
  const [codeEntry, setCodeEntry] = useState('');
  const [selectedValue, setSelectedValue] = useState("AI");
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="mainContainer">
      <div className='horizontalPart'>
        <textarea 
          className='codeEntry' 
          placeholder='Enter code here...'
          value={codeEntry}
          onChange={(e) => setCodeEntry(e.target.value)}
        ></textarea>
      </div>

      <div className='horizontalPart verticallyCentered'>
        <select 
          value={selectedValue} 
          onChange={handleSelectChange}
        >
          <option value="AI">AI</option>
        </select>

        {selectedValue === "AI" && (
          <input 
            type="text" 
            className="apiKeyInput" 
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        )}

        <textarea
          className="promptInput"
          placeholder="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        
        <button className="runButton">Run</button>
        
        <textarea 
          className="outputBox" 
          placeholder="Output"
          value={output}
          onChange={(e) => setOutput(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
