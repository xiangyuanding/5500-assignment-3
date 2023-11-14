import React, { useState, useEffect } from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import SpreadSheetClient from "../Engine/SpreadSheetClient";
import SheetHolder from "./SheetHolder";

import { ButtonNames } from "../Engine/GlobalDefinitions";
import ServerSelector from "./ServerSelector";


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
const spreadSheetClient = new SpreadSheetClient('test', 'juancho');

function SpreadSheet({ userName, documentName ,resetURL }: SpreadSheetProps) {
  const [formulaString, setFormulaString] = useState(spreadSheetClient.getFormulaString())
  const [resultString, setResultString] = useState(spreadSheetClient.getResultString())
  const [cells, setCells] = useState(spreadSheetClient.getSheetDisplayStringsForGUI());
  const [statusString, setStatusString] = useState(spreadSheetClient.getEditStatusString());
  const [currentCell, setCurrentCell] = useState(spreadSheetClient.getWorkingCellLabel());
  const [currentlyEditing, setCurrentlyEditing] = useState(spreadSheetClient.getEditStatus());
  const [cellsBeingEdited, setCellsBeingEdited] = useState(spreadSheetClient.getCellsBeingEdited());
  const [serverSelected, setServerSelected] = useState("localhost");


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
      spreadSheetClient.addCell(realCellLabel);  // this will never be ""
      updateDisplayValues();
    }
    // if the edit status is false then set the current cell to the clicked on cell
    else {
      spreadSheetClient.requestViewByLabel(realCellLabel);

      updateDisplayValues();
    }

  }

  return (
    <div>
      <Formula formulaString={formulaString} resultString={resultString}  ></Formula>
      <Status statusString={statusString}></Status>
      {userName? <h3> You are currently logged in as {userName}</h3> : <h3> You are currently not logined, document cannot be edited and saved.</h3>}
      {<SheetHolder cellsValues={cells}
        onClick={onCellClick}
        currentCell={currentCell}
        currentlyEditing={currentlyEditing} 
        cellsBeingEdited={cellsBeingEdited}></SheetHolder>}
      <KeyPad onButtonClick={onButtonClick}
        onCommandButtonClick={onCommandButtonClick}
        currentlyEditing={currentlyEditing}></KeyPad>
      <button onClick={() => resetURL('files')
        }>Return to File Browser</button>
      <ServerSelector serverSelector={serverSelector} serverSelected={serverSelected} />
    </div>
  )
};

export default SpreadSheet;