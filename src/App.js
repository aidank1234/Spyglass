import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { explainCode } from './OpenAI.helper';
// Import necessary modes and themes for Ace Editor
import './App.css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

function App() {
  const [codeEntry, setCodeEntry] = useState(''); // State for AceEditor content
  const [selectedOption, setSelectedOption] = useState('AI'); // State for select box
  const [apiKey, setApiKey] = useState(''); // State for API key input
  const [promptText, setPromptText] = useState(''); // State for Prompt text input
  const [outputText, setOutputText] = useState(''); // State for Output textarea

  const handleRun = () => {
    explainCode(codeEntry, (newWord) => {
      setOutputText((prevOutputText) => prevOutputText + newWord);
    });
  };

  return (
    <div className="mainContainer">
      <div className='horizontalPart'>
        <AceEditor
          mode="javascript"
          theme="monokai"
          name="codeEditor"
          className="roundedEditor"
          value={codeEntry}
          onChange={setCodeEntry}
          width="96%"
          height="90%"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false,
          }}
        />
      </div>
      <div className="horizontalPart">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="AI">AI</option>
        </select>

        {selectedOption === 'AI' && (
          <input
            type="text"
            placeholder="API Key"
            className="promptInput"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        )}

        <input
          type="text"
          placeholder="Prompt"
          className="promptInput"
          id="prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
        
        <button className="runButton" onClick={handleRun}>Run</button>

        <textarea
          className="outputBox"
          placeholder="Output"
          value={outputText}
          readOnly
        />
      </div>
    </div>
  );
}

export default App;
