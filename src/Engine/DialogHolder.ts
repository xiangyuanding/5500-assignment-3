import * as fs from 'fs';
import * as path from 'path';
import { SpreadSheetController } from "./SpreadSheetController";
import { create } from 'domain';

// DialogHolder is responsible for managing the dialogs
export class DialogHolder {

    private _dialogFolder: string;

    constructor() {
        const rootPath = path.join(__dirname, '..', '..');
        this._dialogFolder = path.join(rootPath, 'dialogs');
        this._initializeDialogDirectory();
    }

    // initialize the directory where we will store the dialogs
    private _initializeDialogDirectory(): void {
        if (!fs.existsSync(this._dialogFolder)) {
            fs.mkdirSync(this._dialogFolder, { recursive: true });
        }
    }

    // save the dialog to the file system
    public saveDialog(name: string, sender: string, text: string): void {
      console.log("saveDialog");
        const dialogPath = path.join(this._dialogFolder, name + '.json');
        this.createDialog(name);
        let dialogFile = fs.readFileSync(dialogPath, "utf8");
        let dialog = JSON.parse(dialogFile);
        //get current timestamp
        const currentTimestamp: number = new Date().getTime();
        let content = {
            timestamp: currentTimestamp,
            sender: sender,
            text: text
        };
        console.log(dialog);
        dialog.dialog.push(content);
        console.log(dialog);
        let dialogJSON = JSON.stringify(dialog);
        fs.writeFileSync(dialogPath, dialogJSON);
    }

    // create the dialog file if it does not exist
    public createDialog(name: string): boolean {
        if (fs.existsSync(path.join(this._dialogFolder, name + '.json'))) {
            return false
        }
        let content:object[] = [];
        let dialog = {dialog: content};
        let jsonString = JSON.stringify(dialog);
        try {
          fs.writeFileSync(path.join(this._dialogFolder, name + '.json'), jsonString, 'utf8');
        } catch (err) {
          console.error('Error writing to JSON file (sync):', err);
        }
        return true;
    }

    // get the dialogs based on the pointer
    public getDialogs(name: string, pointer: number): string {
      this.createDialog(name);
      const dialogPath = path.join(this._dialogFolder, name + '.json');
      let dialogFile = fs.readFileSync(dialogPath, "utf8");
      let dialog = JSON.parse(dialogFile);
      dialog.dialog = dialog.dialog.slice(-pointer);
      const documentJSON = JSON.stringify(dialog);
      return documentJSON;
    }

}

