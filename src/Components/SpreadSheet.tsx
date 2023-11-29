import React, { useState, useEffect } from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import SpreadSheetClient from "../Engine/SpreadSheetClient";
import SheetHolder from "./SheetHolder";
import Chat from "./Chat";
import "./SpreadSheet.css";
import { ButtonNames } from "../Engine/GlobalDefinitions";
import ServerSelector from "./ServerSelector";
// import app css
import "../App.css";
import "./Formula.css";
import "./Status.css";
import "./SheetHolder.css";
import "./Chat.css";
import "./KeyPad.css";


interface SpreadSheetProps {
  documentName: string;
  userName: string;
  resetURL: (documentName: string) => void;
}

/**
 * the main component for the Spreadsheet.  It is the parent of all the other components
 *
 *
 * */

// create the client that talks to the backend.
const spreadSheetClient = new SpreadSheetClient("test", "juancho");

function SpreadSheet({ userName, documentName, resetURL }: SpreadSheetProps) {
  const [formulaString, setFormulaString] = useState(
    spreadSheetClient.getFormulaString()
  );
  const [resultString, setResultString] = useState(
    spreadSheetClient.getResultString()
  );
  const [cells, setCells] = useState(
    spreadSheetClient.getSheetDisplayStringsForGUI()
  );
  const [statusString, setStatusString] = useState(
    spreadSheetClient.getEditStatusString()
  );
  const [currentCell, setCurrentCell] = useState(
    spreadSheetClient.getWorkingCellLabel()
  );
  const [currentlyEditing, setCurrentlyEditing] = useState(
    spreadSheetClient.getEditStatus()
  );
  const [cellsBeingEdited, setCellsBeingEdited] = useState(
    spreadSheetClient.getCellsBeingEdited()
  );
  const [serverSelected, setServerSelected] = useState("localhost");
  const [zoomLevel, setZoomLevel] = useState(100);

  function updateDisplayValues(): void {
    spreadSheetClient.userName = userName;
    spreadSheetClient.documentName = documentName;
    setFormulaString(spreadSheetClient.getFormulaString());
    setResultString(spreadSheetClient.getResultString());
    setStatusString(spreadSheetClient.getEditStatusString());
    setCells(spreadSheetClient.getSheetDisplayStringsForGUI());
    setCurrentCell(spreadSheetClient.getWorkingCellLabel());
    setCurrentlyEditing(spreadSheetClient.getEditStatus());
    setCellsBeingEdited(spreadSheetClient.getCellsBeingEdited());
  }

  // useEffect to refetch the data every 1/20 of a second
  useEffect(() => {
    const interval = setInterval(() => {
      updateDisplayValues();
    }, 50);
    return () => clearInterval(interval);
  });

  /**
   *
   * @param event
   *
   * This function is the call back for the command buttons
   *
   * It will call the machine to process the command button
   *
   * the buttons done, edit, clear, all clear, and restart do not require asynchronous processing
   *
   * the other buttons do require asynchronous processing and so the function is marked async
   */
  async function onCommandButtonClick(text: string): Promise<void> {
    switch (text) {
      case ButtonNames.edit_toggle:
        if (currentlyEditing) {
          spreadSheetClient.setEditStatus(false);
        } else {
          if (currentCell in cellsBeingEdited) {
            alert("This cell is being edited by others!");
          }
          spreadSheetClient.setEditStatus(true);
        }
        setStatusString(spreadSheetClient.getEditStatusString());
        console.log(statusString);
        break;

      case ButtonNames.clear:
        spreadSheetClient.removeToken();
        break;

      case ButtonNames.allClear:
        spreadSheetClient.clearFormula();
        break;
    }
    // update the display values
    updateDisplayValues();
  }

  /**
   *  This function is the call back for the number buttons and the Parenthesis buttons
   *
   * They all automatically start the editing of the current formula.
   *
   * @param event
   *
   * */
  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const text = event.currentTarget.textContent;
    let trueText = text ? text : "";
    spreadSheetClient.setEditStatus(true);
    spreadSheetClient.addToken(trueText);

    updateDisplayValues();
  }

  // this is to help with development,  it allows us to select the server
  function serverSelector(buttonName: string) {
    setServerSelected(buttonName);
    spreadSheetClient.setServerSelector(buttonName);
  }

  /**
   *
   * @param event
   *
   * This function is called when a cell is clicked
   * If the edit status is true then it will send the token to the machine.
   * If the edit status is false then it will ask the machine to update the current formula.
   */
  function onCellClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const cellLabel = event.currentTarget.getAttribute("cell-label");
    // calculate the current row and column of the clicked on cell

    const editStatus = spreadSheetClient.getEditStatus();
    let realCellLabel = cellLabel ? cellLabel : "";

    // if the edit status is true then add the token to the machine
    if (editStatus) {
      spreadSheetClient.addCell(realCellLabel); // this will never be ""
      updateDisplayValues();
    }
    // if the edit status is false then set the current cell to the clicked on cell
    else {
      spreadSheetClient.requestViewByLabel(realCellLabel);

      updateDisplayValues();
    }
  }

  // State to store the current background color
  const [backgroundColor, setBackgroundColor] = useState<string>("#282c34");
  const [commentColor, setCommentColor] = useState<string>("white");
  const [chatBoxColor, setChatBoxColor] = useState<string>("#343841");
  const [calculateBorderColor, setCalculateBorderColor] = useState<string>("#000000");
  const [formulaNumberColor, setFormulaNumberColor] = useState<string>("#039703");

  // Function to handle the button click
  const handleButtonClick = () => {
    // console.log("previous" , backgroundColor);
    // setBackgroundColor(backgroundColor => backgroundColor === '#282c34' ? 'white' :  '#282c34');
    // setCommentColor(prevColor => prevColor === 'white' ? '#000000' :  'white');
    // setChatBoxColor(prevColor => prevColor === '#343841' ? 'lightgreen' :  '#343841');
    // console.log(backgroundColor);
    setBackgroundColor((prevBackgroundColor) => {
      const newBackgroundColor =
        prevBackgroundColor === "#282c34" ? "white" : "#282c34";
      document.documentElement.style.setProperty(
        "--background-color",
        newBackgroundColor
      );
      return newBackgroundColor;
    });
    // 
    setCommentColor((prevCommentColor) => {
      const newCommentColor =
        prevCommentColor === "white" ? "#000000" : "white";
        document.documentElement.style.setProperty("--formula_color", newCommentColor);
        document.documentElement.style.setProperty("--status_name", newCommentColor);
        document.documentElement.style.setProperty("--h3-color", newCommentColor);
        document.documentElement.style.setProperty(
          "--sheet-holder-color",
          newCommentColor
        );
      return newCommentColor;
    });
    //
    setChatBoxColor((prevChatBoxColor) => {
      const newChatBoxColor =
        prevChatBoxColor === "#343841" ? "lightgreen" : "#343841";
      document.documentElement.style.setProperty(
        "--chat-color",
        newChatBoxColor
      );
      return newChatBoxColor;
    });
    //
    setCalculateBorderColor((prevCalculateBorderColor) => {
      const newCalculateBorderColor =
        prevCalculateBorderColor === "#000000" ? "lightgrey" : "#000000";
      document.documentElement.style.setProperty(
        "--border-color",
        newCalculateBorderColor
      );
      return newCalculateBorderColor;
    });
    //
    setFormulaNumberColor((prevFormulaNumberColor) => {
      const newFormulaNumberColor =
        prevFormulaNumberColor === "#039703" ? "white" : "#039703";
      document.documentElement.style.setProperty(
        "--formula-number-color",
        newFormulaNumberColor
      );
      return newFormulaNumberColor;
    });

  };

  return (
    <div>
      <div>
        <button onClick={handleButtonClick}>Change Background Color</button>
      </div>
      <Formula
        formulaString={formulaString}
        resultString={resultString}
      ></Formula>
      <Status statusString={statusString}></Status>
      {userName ? (
        <h3
          className="h3-color"
          style={{ overflowWrap: "break-word", maxWidth: "1000px" }}
        >
          {" "}
          You are currently logged in as {userName}
        </h3>
      ) : (
        <h3>
          {" "}
          You are currently not logined, document cannot be edited and saved.
        </h3>
      )}
      <div className="spreadsheet-layout">
        <div className="spreadsheet-container">
          {
            <SheetHolder
              cellsValues={cells}
              onClick={onCellClick}
              currentCell={currentCell}
              currentlyEditing={currentlyEditing}
              cellsBeingEdited={cellsBeingEdited}
            ></SheetHolder>
          }
          <KeyPad
          
            onButtonClick={onButtonClick}
            onCommandButtonClick={onCommandButtonClick}
            currentlyEditing={currentlyEditing}
          ></KeyPad>
          <button onClick={() => resetURL("files")}>
            Return to File Browser
          </button>
          <ServerSelector
            serverSelector={serverSelector}
            serverSelected={serverSelected}
          />
        </div>
        <div className="Chat">
          <text className="chat-name-color">
            use below buttons to change the size
          </text>
          <div>
            <button onClick={() => setZoomLevel(120)}>Large</button>
            <button onClick={() => setZoomLevel(100)}>Regular</button>
          </div>
          <div style={{ transform: `scale(${zoomLevel / 100})` }}>
            <h1 className="chat-name-color">Chat</h1>
            <Chat name={documentName} userName={userName} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpreadSheet;
