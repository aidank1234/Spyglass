import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { explainCode, explainCodeNoStream } from './OpenAI.helper';
import logo from './spyLogo.png'; // Import your logo image
// Import necessary modes and themes for Ace Editor
import './App.css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import {matchRegex} from "./regex.helper";

function App() {
  const [codeEntry, setCodeEntry] = useState('Paste your smart contract here'); // State for AceEditor content
  const [selectedOption, setSelectedOption] = useState('AI'); // State for select box
  const [apiKey, setApiKey] = useState(''); // State for API key input
  const [detectorName, setDetectorName] = useState(''); // State for Detector name input
  const [promptText, setPromptText] = useState(''); // State for Prompt text input
  const [outputText, setOutputText] = useState(''); // State for Output textarea
  const [list, setList] = useState([]); // State for list of JSON name-prompt entries
  const [viewMode, setViewMode] = useState(false);

  const handleRun = () => {
    setOutputText("");
    if (selectedOption === "AI")
      explainCode(codeEntry, promptText, apiKey, (newWord) => {
        if (!!newWord) {
          setOutputText((prevOutputText) => prevOutputText + newWord);
        }
      });
    else if (selectedOption === "regex")
      matchRegex(codeEntry, promptText).then(res => {
        setOutputText((prevOutputText) => prevOutputText + res);
      });
  };

  useEffect(() => {
    if (list.length) {
      setPromptText(list[0].prompt);
      console.log(list[0]);
      if (list[0].r) {
        setSelectedOption("regex");
      } else {
        setSelectedOption("AI");
      }
    }
  }, [list]);


  const handleRunAll = async () => {
    setOutputText("");
    for (const item of list) {
      setOutputText((prevOutputText) => prevOutputText + item.name + ": ");
      console.log(item);
      if (item.r) {
        const matchR = await matchRegex(codeEntry, item.prompt);
        setOutputText((prevOutputText) => prevOutputText + matchR + "\n\n");
      } else {
        const response = await explainCodeNoStream(codeEntry, item.prompt, apiKey);
        setOutputText((prevOutputText) => prevOutputText + response.content + "\n\n");
      }
    }
  }

  const handleFileDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.prompt }), {})));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "detectors.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

  const handleAddDetector = () => {
    if (!viewMode) {
      if (detectorName.trim() && promptText.trim()) {
        setList([...list, { name: detectorName, prompt: promptText, r: selectedOption === "AI" ? false : true }]);
        setDetectorName(''); // clear the input fields after adding
        setViewMode(true);
      }
    } else {
      setPromptText('');
      setViewMode(false);
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
        <select
          value={selectedOption}
          disabled={viewMode}
          className="typeSelect"
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="AI">AI</option>
          <option value="regex">Regex</option>
          <option value="AST" disabled>AST Walker</option>
          <option value="unitTest" disabled>Foundry test</option>
          <option value="slither" disabled>Slither detector</option>
        </select>
          {selectedOption === "AI" && <input
            type="password"
            placeholder="OpenAI API Key"
            className="promptInput"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          /> }
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: "100%" }}>
          {viewMode ? (
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
          <button className='newButton' disabled={!viewMode && (!detectorName || !promptText)} onClick={handleAddDetector} style={{height: "40px", width: 60, marginBottom: 8, borderRadius: '5px', border: 'none'}}>{viewMode ? 'New' : 'Save'}</button>
          </div>
          
          <textarea
            type="text"
            placeholder={selectedOption === "AI" ? "Detector (yes or no question)" : "Detector (regex)"}
            className="promptInput"
            id="prompt"
            value={promptText}
            disabled={viewMode}
            onChange={(e) => setPromptText(e.target.value)}
          />
        <button className="runButton" disabled={(!apiKey && selectedOption === "AI")|| !promptText || !detectorName || codeEntry === 'Paste your smart contract here'} onClick={handleRun}>Run</button>
        {list.length > 1 &&
          <button className="runButton" disabled={codeEntry === 'Paste your smart contract here' || !apiKey} onClick={handleRunAll}>Run All Detectors</button>
        }
        <button className="runButton" onClick={handleFileDownload}>Download Detectors</button>
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
