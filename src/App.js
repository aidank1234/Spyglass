import React from 'react';
import './App.css';

function App() {
  return (
    <div className="mainContainer">
      <div className='horizontalPart'>
        <textarea placeholder="Enter your code here..." className="codeEntry"></textarea>
      </div>
      <div className='horizontalPart'>
        <select defaultValue="AI">
          <option value="AI">AI</option>
        </select>
        <textarea placeholder="Prompt" className="promptInput"></textarea>
        <button className="runButton">Run</button>
        <textarea placeholder="Output" className="outputBox"></textarea>
      </div>
    </div>
  );
}

export default App;
