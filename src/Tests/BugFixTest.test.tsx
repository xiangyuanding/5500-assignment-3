
import { render, screen} from "@testing-library/react";
import SpreadSheet from '../Components/SpreadSheet';

describe('Bug Fixed Test - to test the css', () => {
    it ('To Ensure the fixed has css that could prevent name overflow"',()=> {
    const userName = 'pyyggmzykyfjmfoamsqbshiamjwfalyirknoqtjavnrdrrzkacbzrhgkxjxbzefhyxfrxngretdeuwnvfzfxomxndewadwhbfwsl';
    const sheetTestName = 'test' + 13;
    const resetURL = jest.fn();
    render(<SpreadSheet documentName={sheetTestName} userName = {userName} resetURL = {resetURL}/>)
    expect(screen.getByText("You are currently logged in as pyyggmzykyfjmfoamsqbshiamjwfalyirknoqtjavnrdrrzkacbzrhgkxjxbzefhyxfrxngretdeuwnvfzfxomxndewadwhbfwsl").closest("h3")).toHaveStyle(
        "overflow-wrap: break-word;");
    });
    it ('To Ensure the screen has the full username displayed"',()=> {
        const userName = 'pyyggmzykyfjmfoamsqbshiamjwfalyirknoqtjavnrdrrzkacbzrhgkxjxbzefhyxfrxngretdeuwnvfzfxomxndewadwhbfwsl';
        const sheetTestName = 'test' + 14;
        const resetURL = jest.fn();
        render(<SpreadSheet documentName={sheetTestName} userName = {userName} resetURL = {resetURL}/>)
        expect(screen.getByText("You are currently logged in as pyyggmzykyfjmfoamsqbshiamjwfalyirknoqtjavnrdrrzkacbzrhgkxjxbzefhyxfrxngretdeuwnvfzfxomxndewadwhbfwsl")).toBeInTheDocument();
    });
});