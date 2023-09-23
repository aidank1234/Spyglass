import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { explainCode } from './OpenAI.helper';
import logo from './spyLogo.png'; // Import your logo image
// Import necessary modes and themes for Ace Editor
import './App.css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

function App() {
  const [codeEntry, setCodeEntry] = useState('Paste your smart contract here'); // State for AceEditor content
  const [selectedOption, setSelectedOption] = useState('AI'); // State for select box
  const [apiKey, setApiKey] = useState(''); // State for API key input
  const [detectorName, setDetectorName] = useState(''); // State for Detector name input
  const [promptText, setPromptText] = useState(''); // State for Prompt text input
  const [outputText, setOutputText] = useState(''); // State for Output textarea
  const [list, setList] = useState([]); // State for list of JSON name-prompt entries

  const handleRun = () => {
    setOutputText("");
    explainCode(codeEntry, promptText, (newWord) => {
      if (!!newWord) {
        setOutputText((prevOutputText) => prevOutputText + newWord);
      }
    });
  };

  const handleFileDownload = () => {
    const jsonData = JSON.stringify({ [detectorName]: promptText });
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inputData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsedObj = JSON.parse(event.target.result);
          const parsedList = Object.entries(parsedObj).map(([name, prompt]) => ({ name, prompt }));
          if (parsedList.length > 0) {
            setList(parsedList);
            setDetectorName(parsedList[0].name);
            setPromptText(parsedList[0].prompt);
          }
        } catch (error) {
          console.error('Invalid JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDetectorChange = (e) => {
    const selectedName = e.target.value;
    const selectedEntry = list.find((entry) => entry.name === selectedName);
    if (selectedEntry) {
      setDetectorName(selectedEntry.name);
      setPromptText(selectedEntry.prompt);
    }
  };

  return (
    <div className="mainContainer">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <span className="label">Spyglass</span>
      </div>

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
        {/* <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="AI">AI</option>
        </select> */}

        {selectedOption === 'AI' && (
          <>
            <input
              type="text"
              placeholder="OpenAI API Key"
              className="promptInput"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {list.length > 1 ? (
               <select onChange={handleDetectorChange} value={detectorName} className="promptInput">
               {list.map((entry, index) => <option key={index} value={entry.name}>{entry.name}</option>)}
             </select>
            ) : (
              <input
              type="text"
              placeholder="Detector Name"
              className="promptInput"
              value={detectorName}
              onChange={(e) => setDetectorName(e.target.value)}
            />
            )}
           
            <textarea
              type="text"
              placeholder="Detector (yes or no question)"
              className="promptInput"
              id="prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </>
        )}
        <button className="runButton" onClick={handleRun}>Run</button>
        <button className="runButton" onClick={handleFileDownload}>Download Detector</button>
        <label className="fileUploadWrapper">Upload Detectors<input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} /></label>

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
