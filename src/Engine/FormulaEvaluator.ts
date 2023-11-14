import Cell from "./Cell"
import SheetMemory from "./SheetMemory"
import { ErrorMessages } from "./GlobalDefinitions";
import e from "express";



export class FormulaEvaluator {
  // Define a function called update that takes a string parameter and returns a number
  private _errorOccured: boolean = false;
  private _errorMessage: string = "";
  private _currentFormula: FormulaType = [];
  private _lastResult: number = 0;
  private _sheetMemory: SheetMemory;
  private _result: number = 0;


  constructor(memory: SheetMemory) {
    this._sheetMemory = memory;
  }

  /**
    Now the evauluate fuction works; it takes a formula and returns a number.
    * 
   */

  evaluate(formula: FormulaType) {
    this._lastResult = 0;
    this._currentFormula = [...formula];
    if(formula.length === 0) {
      this._result = 0;
      this._errorMessage = ErrorMessages.emptyFormula;
      return;
    }
    this._errorOccured = false;
    this._errorMessage = "";
    this._result = this.plus();
    if ( this._currentFormula.length > 0) {
      if (!this._errorOccured) {
        this._errorMessage = ErrorMessages.invalidFormula;
      }
      this._errorOccured = true;
    }
    if (this._errorOccured) {
      this._result = this._lastResult;
    }
  }

  public get error(): string {
    return this._errorMessage
  }

  public get result(): number {
    return this._result;
  }

  //use this function to excutate + and - operators
  private plus(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    let result = this.multiply();
    while ( this._currentFormula.length > 0 && this.operatorLevel() === 1) {
      let operator = this._currentFormula.shift();
      let num = this.multiply();
      if (operator === "+") {
        result += num;
      } else if(operator === "-") {
        result -= num;
      }
    }
    this._lastResult = result;
    return result;
  }

  //for operators like sin and x^2, the input form is like 2sin, which means sin(2)
  private multiply(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    let result = this.getNumber();
    while ( this._currentFormula.length > 0 && this.operatorLevel() > 1) {
      let level = this.operatorLevel();
      let operator = this._currentFormula.shift();
      if (this._errorOccured && level === 3) {
        this._errorOccured = false;
        this._errorMessage = "";
      }
      if (level === 3) {
        
        if (operator === "x²") {
          result = Math.pow(result, 2);
        } else if (operator === "x³") {
          result = Math.pow(result, 3);
        } else if (operator === "1/x") {
          if (result === 0) {
            this._errorOccured = true;
            this._errorMessage = ErrorMessages.divideByZero;
            this._lastResult = Infinity;
            return Infinity;
          } else {
            result = 1 / result;
          }
        } else if (operator === "x^(1/2)") {
          if (result < 0) {
            this._errorOccured = true;
            this._errorMessage = ErrorMessages.root;
            this._lastResult = NaN;
            return NaN;
          } else {
            result = Math.sqrt(result);
          }
        } else if (operator === "x^(1/3)") {
          result = Math.cbrt(result);
        } else if (operator === "sin") {
          result = Math.sin(result);
        } else if (operator === "cos") {
          result = Math.cos(result);
        } else if (operator === "tan") {
          result = Math.tan(result);
        } else if (operator === "sin⁻¹x") {
          if(result > 1 || result < -1){
            this._errorOccured = true;
            this._errorMessage = ErrorMessages.invalidNumber;
            this._lastResult = NaN;
            return NaN;
          }
          result = Math.asin(result);
        } else if (operator === "cos⁻¹x") {
          if(result > 1 || result < -1){
            this._errorOccured = true;
            this._errorMessage = ErrorMessages.invalidNumber;
            this._lastResult = NaN;
            return NaN;
          }
          result = Math.acos(result);
        } else if (operator === "tan⁻¹x") {
          result = Math.atan(result);
        } else if (operator === "rand") {
          if(result <= 1){
            result = Math.random();
          } else {
            result = Math.random() * result;
          }
        } else if (operator === "+/-") {
          result = -result;
        }
        continue;
      }
      let num = this.getNumber();
      if (operator === "*") {
        result *= num;
      } else if(operator === "/") {
        if (num === 0) {
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.divideByZero;
          this._lastResult = Infinity;
          return Infinity;
        }
        result /= num;
      }
    }
    this._lastResult = result;
    return result;
  }

    //use this function to get a number friom the formula
  private getNumber(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    if (this._currentFormula.length === 0) {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.partial;
      return 0;
    }

    let token = this._currentFormula.shift();

    if (this.isNumber(token)) {
      this._lastResult = Number(token);
      return Number(token);

    } else if (this.isCellReference(token)) {
      return this.dealCellReference(token);

    } else if (token === "(") {
      return this.dealParentheses();
    } else {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.invalidFormula;
      return 0;
    }
  }

  private operatorLevel(): number {
    if (this._currentFormula[0] === "+" || this._currentFormula[0] === "-") {
      return 1;
    } else if (
      this._currentFormula[0] === "*" ||
      this._currentFormula[0] === "/"
    ) {
      return 2;
    } else if (
      this._currentFormula[0] === "1/x" ||
      this._currentFormula[0] === "x^(1/2)" ||
      this._currentFormula[0] === "x^(1/3)" ||
      this._currentFormula[0] === "sin" ||
      this._currentFormula[0] === "cos" ||
      this._currentFormula[0] === "tan" ||
      this._currentFormula[0] === "sin⁻¹x" ||
      this._currentFormula[0] === "cos⁻¹x" ||
      this._currentFormula[0] === "tan⁻¹x" ||
      this._currentFormula[0] === "rand" ||
      this._currentFormula[0] === "+/-" ||
      this._currentFormula[0] === "x²" ||
      this._currentFormula[0] === "x³"
    ) {
      return 3;
    } else {
      return 0;
    }
  }
  //use this function to deal with parentheses when getting numbers
  private dealParentheses(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    let result = this.plus();
    if (this._currentFormula.length === 0 || this._currentFormula.shift() !== ")") {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.missingParentheses;
      this._lastResult = result;
      return result;
    }
    return result;
  }
  //use this function to deal with cell reference when getting numbers
  private dealCellReference(token: TokenType): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    [this._lastResult, this._errorMessage] = this.getCellValue(token);

    if (this._errorMessage !== "") {
      this._errorOccured = true;
    }
    return this._lastResult;
    
  }
  


  /**
   * 
   * @param token 
   * @returns true if the toke can be parsed to a number
   */
  isNumber(token: TokenType): boolean {
    return !isNaN(Number(token));
  }

  /**
   * 
   * @param token
   * @returns true if the token is a cell reference
   * 
   */
  isCellReference(token: TokenType): boolean {

    return Cell.isValidCellLabel(token);
  }

  /**
   * 
   * @param token
   * @returns [value, ""] if the cell formula is not empty and has no error
   * @returns [0, error] if the cell has an error
   * @returns [0, ErrorMessages.invalidCell] if the cell formula is empty
   * 
   */
  getCellValue(token: TokenType): [number, string] {

    let cell = this._sheetMemory.getCellByLabel(token);
    let formula = cell.getFormula();
    let error = cell.getError();

    // if the cell has an error return 0
    if (error !== "" && error !== ErrorMessages.emptyFormula) {
      return [0, error];
    }

    // if the cell formula is empty return 0
    if (formula.length === 0) {
      return [0, ErrorMessages.invalidCell];
    }


    let value = cell.getValue();
    return [value, ""];

  }


}

export default FormulaEvaluator;