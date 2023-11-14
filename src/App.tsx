/**
 * @jest-environment jsdom
 */

import { useState, useEffect } from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';
import { FileSelector } from './Components/FileSelector';

function App() {

  const [userName, setUserName] = useState('');
  const [documentName, setDocumentName] = useState(getDocumentNameFromWindow());
  //const memoryUsage = process.memoryUsage();
  useEffect(() => {
    if (window.location.href) {
      setDocumentName(getDocumentNameFromWindow());
    }
  }, [getDocumentNameFromWindow]);

  useEffect(() => {
    const storedUserName = window.sessionStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    else{
      setUserName("");
    }
  }, []);


  // for the purposes of this demo and for the final project
  // we will use the window location to get the document name
  // this is not the best way to do this, but it is simple
  // and it works for the purposes of this demo
  function getDocumentNameFromWindow() {
    const href = window.location.href;

    // remove  the protocol 
    const protoEnd = href.indexOf('//');
    // find the beginning of the path
    const pathStart = href.indexOf('/', protoEnd + 2);

    if (pathStart < 0) {
      // there is no path
      return '';
    }
    // get the first part of the path
    const docEnd = href.indexOf('/', pathStart + 1);
    if (docEnd < 0) {
      // there is no other slash
      return href.substring(pathStart + 1);
    }
    // there is a slash
    return href.substring(pathStart + 1, docEnd);

  }

  //callback function to reset the current URL to have the document name
  function resetURL(documentName: string) {
    // get the current URL
    const currentURL = window.location.href;
    // remove anything after the last slash
    const index = currentURL.lastIndexOf('/');
    const newURL = currentURL.substring(0, index + 1) + documentName;
    // set the URL
    window.history.pushState({}, '', newURL);
    // now reload the page
    window.location.reload();
  }

  if (documentName === '') {
    setDocumentName('files');
    resetURL('files');
  }

  function getSheetDisplay() {
    return <div>
      <SpreadSheet userName = {userName} documentName={documentName} resetURL={resetURL}  />
    </div>
  }

  function getControlPlane() {
    return <FileSelector userName = {userName} resetURL={resetURL} />
  }

  function getDisplayComponent() {
    if (documentName === 'files' || documentName === '') {
      return <div>
        {getLoginComponent()}
        {getControlPlane()}
        </div>
    } else {
      return getSheetDisplay();
    }
  }

  function getUserLogin() {
    return <div className='loginName'>
      <input
        type="text"
        placeholder="User name"
        defaultValue={userName}
        onChange={(event) => {
          // get the text from the input
          let userName = event.target.value;
          window.sessionStorage.setItem('userName', userName);
          // set the user name
          setUserName(userName);
        }} />
    </div>

  }

  function getLoginComponent() {
    return <table className='login'>
      <tbody>
        <tr className='loginTable'>
          <td>
            <h2>Enter your name to login</h2>
          </td>
          <td>
            {getUserLogin()}
          </td>
        </tr>
      </tbody>
    </table>
  }

  return (
    <div className="App">
      <header className="App-header">
        {getDisplayComponent()}
      </header>
    </div>
  );
}

export default App;


