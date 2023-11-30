import React from "react";

import "./Formula.css";

// FormulaComponentProps
// we pass in value for the formula
// and the value for the current result
type FormulaProps = {
  formulaString: string;
  resultString: string;
}; // interface FormulaProps

const Formula: React.FC<FormulaProps> = ({ formulaString, resultString }) => {
  return (
    <div>
      <span className="formula_color" data-testid="FormulaTitle">
        Formula{" "}
      </span>

      <br />
      <div className="formula">
        <div data-testid="FormulaValue" className="formula-string">{formulaString}</div>
      </div>
      <br />
      <span className="formula_color" data-testid="Result">Result</span>
      <br />
      <div className="formula">
        <div data-testid="FormulaResult" className="formula-string">
          {resultString}
        </div>
      </div>
    </div>
  );
}; // const Formula

export default Formula;
