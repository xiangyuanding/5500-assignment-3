import { render, screen, fireEvent,cleanup,waitFor} from "@testing-library/react";
import fs from 'fs';
import path from 'path';

import Chat from '../../Components/Chat'
import { DialogHolder } from '../../Engine/DialogHolder';

let dialogHolder: DialogHolder;
const dialogTestPath = 'dialogs';
const dialogTestPathFull = path.join(__dirname, '..', '..', '..', dialogTestPath);

beforeAll(() => {
    // remove the test documents folder if it exists
    if (fs.existsSync(dialogTestPathFull)) {
        fs.rmdirSync(dialogTestPathFull, { recursive: true });
    }
    dialogHolder = new DialogHolder();
});

describe('Testing backend to front end', ()=> {
    it('Front end can read message that created in backend', async () => {
        //create message in backend
        const dialogHolder = new DialogHolder();
        const sheetTestName = 'test' + 11
        const userName = 'testUser';
        const message  = 'Test to read message created by backend';
        dialogHolder.createDialog(sheetTestName);
        dialogHolder.saveDialog(sheetTestName,userName,message);
       
        const documentJSON = dialogHolder.getDialogs(sheetTestName,20);
        // unpack the JSON
        const document = JSON.parse(documentJSON);
        expect(document.dialog[0].sender).toEqual('testUser');
        expect(document.dialog[0].text).toEqual('Test to read message created by backend');
        expect(document.dialog[0].timestamp).not.toEqual(null);
        //check if the front end can see the message
        render(<Chat name={sheetTestName} userName = {userName}/>)
        const result =await screen.findByText("testUser: Test to read message created by backend");
        expect(result).toBeInTheDocument;//message is now in the chat window
    });
});
describe('Testing front end to backend', () => {
    it('backend can get message that sent out from front end', async () => {
        const userName = 'testUser';
        const sheetTestName = 'test' + 12;
        render(<Chat name={sheetTestName} userName = {userName}/>)
        expect(screen.queryByText("testUser: Test to get message sent from front end")).not.toBeInTheDocument();//message is not in chat window
        const placeholder = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
        fireEvent.change(placeholder,{target:{value:'Test to get message sent from front end'}});
        const sendButton = screen.getByRole("button",{name:/Send/i});
        fireEvent.click(sendButton);//send the message
        expect(await screen.findByText("testUser: Test to get message sent from front end")).toBeInTheDocument;//wait for message is now in front end
        //check if backend has the data
        const documentJSON = dialogHolder.getDialogs(sheetTestName,20);
        // unpack the JSON
        const document = JSON.parse(documentJSON);
        expect(document.dialog[0].sender).toEqual('testUser');
        expect(document.dialog[0].text).toEqual('Test to get message sent from front end');
        expect(document.dialog[0].timestamp).not.toEqual(null);
    });
});

