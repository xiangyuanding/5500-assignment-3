import { render, screen, fireEvent,cleanup,waitFor} from "@testing-library/react";
import fs from 'fs';
import path from 'path';
import { promises } from "stream";

import Chat from '../../Components/Chat';
import FileSelector from "../../Components/FileSelector"
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
beforeEach(async ()=> await Promise.resolve());


describe('Frond End test', () => {
    it ('Send Button exists in the document', () => {
        const userName = 'testUser';
        const sheetTestName = 'test' + 4;
        render(<Chat name={sheetTestName} userName = {userName}  />)
        expect(screen.getByText("Send")).toBeInTheDocument();
    })

    it ('Type a message... in placeholder', () => {
        const userName = 'testUser';
        const sheetTestName = 'test' + 5;
        render(<Chat name={sheetTestName} userName = {userName}  />)
        const placeholder = screen.getByPlaceholderText('Type a message...')
        expect(placeholder).toBeInTheDocument();
    })

    it ('User can type in the message', () => {
        const userName = 'testUser';
        const sheetTestName = 'test' + 6;
        render(<Chat name={sheetTestName} userName = {userName}  />)
        const placeholder = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
        fireEvent.change(placeholder,{target:{value:'Hello'}});
        expect(placeholder.value).toBe("Hello");
    })

    it ('User can send the message and message correcly displayed with username and the text', async () => {
        const userName = 'testUser';
        const sheetTestName = 'test' + 7;
        render(<Chat name={sheetTestName} userName = {userName}/>)
        expect(screen.queryByText("testUser: I love 5500")).not.toBeInTheDocument();//message is not in chat window before sending the message
        const placeholder = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
        fireEvent.change(placeholder,{target:{value:'I love 5500'}});
        const sendButton = screen.getByRole("button",{name:/Send/i});
        fireEvent.click(sendButton);//send the message
        await new Promise(resolve => setTimeout(resolve, 3000));
        expect(await screen.findByText("testUser: I love 5500")).toBeInTheDocument;//message is now in the chat window
    })

    it ('User cannot send blank message', async () => {
        const userName = 'testUser';
        const sheetTestName = 'test' + 8;
        render(<Chat name={sheetTestName} userName = {userName}/>)
        const placeholder = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
        const sendButton = screen.getByRole("button",{name:/Send/i});
        fireEvent.click(sendButton);//send the message
        await waitFor(()=>{const result = screen.queryByText(/testUser:/i)
        //message does not exist
        expect(result).not.toBeInTheDocument()});
    })

    it ('User can see the historical message in the document',async()=> {
        const userName = 'testUser';
        const userName2 = 'testUser2'
        const sheetTestName = 'test' + 9;
        const resetURL = jest.fn(); 
        render(<Chat name={sheetTestName} userName = {userName}/>)
        expect(screen.queryByText("testUser: Can I see history?")).not.toBeInTheDocument();//message is not in chat window
        const placeholder = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
        fireEvent.change(placeholder,{target:{value:'Can I see history?'}});
        const sendButton = screen.getByRole("button",{name:/Send/i});
        fireEvent.click(sendButton);//send the message
        expect(await screen.findByText("testUser: Can I see history?")).toBeInTheDocument;//message is now in the chat window
        cleanup();
        render(<FileSelector userName = {userName} resetURL={resetURL}/>)
        expect(screen.getByText("File Browser")).toBeInTheDocument();//Confirm we are in home page
        cleanup();
        render(<Chat name={sheetTestName} userName = {userName2}/>)//Go back to previous document with another user
        expect(await screen.findByText("testUser: Can I see history?")).toBeInTheDocument();//message is in the chat window when get back the previous document
    })

    it ('User can read more message when clicking "Load more"',async()=> {
        const userName = 'testUser';
        const sheetTestName = 'test' + 10;
        render(<Chat name={sheetTestName} userName = {userName}/>)
        const placeholder = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
        for (let n =1;n<=21;n++){
            await waitFor(()=>expect(placeholder.value).toBe(""));
            fireEvent.change(placeholder,{target:{value:"The " + n +" message"}});
            const sendButton = screen.getByRole("button",{name:/Send/i});
            fireEvent.click(sendButton);//send the message
        }
        await waitFor(()=>expect(placeholder.value).toBe(""));
        //can see the latest message
        expect(await screen.findByText("testUser: The 21 message")).toBeInTheDocument;
        //the earliest message cannot be seen
        expect(screen.queryByText("testUser: The 1 message")).not.toBeInTheDocument;
        //after clicking "Load More" button, the earliest message can be seen 
        fireEvent.click(screen.getByRole("button",{name:/Load More/i}));
        expect(await screen.findByText("testUser: The 1 message")).toBeInTheDocument;  
    })
});