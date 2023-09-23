import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedValue, setSelectedValue] = useState("AI");

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="mainContainer">
      <div className='horizontalPart'>
        <textarea className='codeEntry' placeholder='Enter code here...'></textarea>
      </div>

      <div className='horizontalPart verticallyCentered'>
        <select value={selectedValue} onChange={handleSelectChange}>
          <option value="AI">AI</option>
        </select>

        {selectedValue === "AI" && (
          <input type="text" className="apiKeyInput" placeholder="API key" />
        )}

        <textarea className="promptInput" placeholder="Prompt"></textarea>
        <button className="runButton">Run</button>
        <textarea className="outputBox" placeholder="Output"></textarea>
      </div>
    </div>
  );
}

export default App;
