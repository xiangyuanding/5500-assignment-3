import fs from 'fs';
import path from 'path';

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

describe('DialogHolder', () => {
    describe('constructor', () => {
        it('should create a dialog holder', () => {
            const dialogHolder = new DialogHolder();
            // the document should be in the right folder

            const result = fs.existsSync(dialogTestPathFull);

            expect(result).toBeTruthy();

        });
    });

    describe('createDialog in specific document', () => {
        it('should create a dialog', () => {
            const dialogHolder = new DialogHolder();
            const sheetTestName = 'test' + 1
            const userName = 'testUser';
            dialogHolder.createDialog(sheetTestName);//document name is test1
            expect(dialogHolder).toBeDefined();
        });
    });

    describe('saveDialog in document', () => {
        it('should get all content: sender, text, timestamp from a dialog successfully', () => {
            const dialogHolder = new DialogHolder();
            const sheetTestName = 'test' + 2
            const userName = 'testUser';
            const message  = 'Hello';
            dialogHolder.createDialog(sheetTestName);//document name is test1
            dialogHolder.saveDialog(sheetTestName,userName,message);
            const documentJSON = dialogHolder.getDialogs(sheetTestName);
            // unpack the JSON
            const document = JSON.parse(documentJSON);
            expect(document.dialog[0].sender).toEqual('testUser');
            expect(document.dialog[0].text).toEqual('Hello');
            expect(document.dialog[0].timestamp).not.toEqual(null);
        });

        it('dialog should be saved in order', () => {
            const dialogHolder = new DialogHolder();
            const sheetTestName = 'test' + 3
            dialogHolder.createDialog(sheetTestName);//document name is test1
            const firstUser = 'firstUser';
            const messageFirst  = 'Hello, How are you?';
            const secondUser = 'secondUser';
            const messageSecond  = 'I am good. Are you ok?';
            const thirdUser = 'thirdUser';
            const messageThird  = 'No. I feel sick';
            dialogHolder.saveDialog(sheetTestName,firstUser,messageFirst);
            dialogHolder.saveDialog(sheetTestName,secondUser,messageSecond);
            dialogHolder.saveDialog(sheetTestName,thirdUser,messageThird);
            const documentJSON = dialogHolder.getDialogs(sheetTestName);
            // unpack the JSON
            const document = JSON.parse(documentJSON);
            expect(document.dialog[0].sender).toEqual('firstUser');
            expect(document.dialog[0].text).toEqual('Hello, How are you?');
            expect(document.dialog[1].sender).toEqual('secondUser');
            expect(document.dialog[1].text).toEqual('I am good. Are you ok?');
            expect(document.dialog[2].sender).toEqual('thirdUser');
            expect(document.dialog[2].text).toEqual('No. I feel sick');
        });
    });
})
