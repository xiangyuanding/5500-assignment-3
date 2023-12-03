import { render, screen,fireEvent,cleanup} from "@testing-library/react";
import SpreadSheet from "../../Components/SpreadSheet";

describe('Zoom in/out in chat window - to test the css', () => {
    it ('To Ensure Zoom in/out works"',async ()=> {
    const userName = 'testUser';
    const sheetTestName = 'test' + 1;
    const resetURL = jest.fn();
    const {container} = render(<SpreadSheet documentName={sheetTestName} userName = {userName} resetURL = {resetURL}/>)
    const zoomInButton = screen.getByRole("button",{name:/zoom-in/i});
    const zoomOutButton = screen.getByRole("button",{name:/zoom-out/i});
    const chatBoxElement = container.querySelector('.chat-box')
    //click the 'Large' button to zoom in the chat window
    fireEvent.click(zoomInButton);
    expect(chatBoxElement).toHaveStyle({transform:'scale(1.2)'})
    //click the 'Regular' button to zoom out the chat window
    fireEvent.click(zoomOutButton);//click the 'Regular' button
    expect(chatBoxElement).toHaveStyle({transform:'scale(1)'})
    });
})


describe('Zoom in/out in calculator sheet - to test the css', () => {
    it ('To test Large buttons works"',async ()=> {
    const userName = 'testUser';
    const sheetTestName = 'test' + 2;
    const resetURL = jest.fn();
    const {container} = render(<SpreadSheet documentName={sheetTestName} userName = {userName} resetURL = {resetURL}/>)
    const largerButton = screen.getByRole("button",{name:/larger-sheet/i});
    const regularButton = screen.getByRole("button",{name:/regular-sheet/i});
    const smallerButton = screen.getByRole("button",{name:/smaller-sheet/i});
    const chatBoxElement = container.querySelector('.spreadsheet-container')
    //click the 'Large' button to make calculator sheet larger
    fireEvent.click(largerButton);
    expect(chatBoxElement).toHaveStyle({transform:'scale(1)'})
    //click the 'Regular' button to make calculator sheet in regular size
    fireEvent.click(regularButton);
    expect(chatBoxElement).toHaveStyle({transform:'scale(0.9)'})
    //click the 'smaller' button to make calculator sheet smaller
    fireEvent.click(smallerButton);
    expect(chatBoxElement).toHaveStyle({transform:'scale(0.7)'})
    });
})

describe('change color test - to test the css', () => {
    it ('To works for changing background color"',()=> {
    const userName = 'testUser';
    const sheetTestName = 'test' + 3;
    const resetURL = jest.fn();
    render(<SpreadSheet documentName={sheetTestName} userName = {userName} resetURL = {resetURL}/>)
    expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--formula-color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--status_name')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--h3-color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--sheet-holder-color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--chat-color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--border-color')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--formula-number-color')).toBe('');
    const changeColorButton = screen.getByRole("button",{name:/change-background-color/i});

    //click 'change background color' button, expect the background color changed
    fireEvent.click(changeColorButton);
    expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('white');
    expect(document.documentElement.style.getPropertyValue('--formula_color')).toBe('#000000');
    expect(document.documentElement.style.getPropertyValue('--status_name')).toBe('#000000');
    expect(document.documentElement.style.getPropertyValue('--h3-color')).toBe('#000000');
    expect(document.documentElement.style.getPropertyValue('--sheet-holder-color')).toBe('#000000');
    expect(document.documentElement.style.getPropertyValue('--border-color')).toBe('lightgrey');
   
    //click 'change background color' button again, expect the background color changed back to origin
    fireEvent.click(changeColorButton);
    expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#282c34');
    expect(document.documentElement.style.getPropertyValue('--formula_color')).toBe('white');
    expect(document.documentElement.style.getPropertyValue('--status_name')).toBe('white');
    expect(document.documentElement.style.getPropertyValue('--h3-color')).toBe('white');
    expect(document.documentElement.style.getPropertyValue('--sheet-holder-color')).toBe('white');
    expect(document.documentElement.style.getPropertyValue('--border-color')).toBe('#000000');
    });
})