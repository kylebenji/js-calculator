import React from "react";

function Buttons({ onButtonClick }) {
  return (
    <div className="button-container" onClick={onButtonClick}>
      <button id="clear">AC</button>
      <button id="seven" className="number" data-val="7">
        7
      </button>
      <button id="eight" className="number" data-val="8">
        8
      </button>
      <button id="nine" className="number" data-val="9">
        9
      </button>
      <button id="four" className="number" data-val="4">
        4
      </button>
      <button id="five" className="number" data-val="5">
        5
      </button>
      <button id="six" className="number" data-val="6">
        6
      </button>
      <button id="one" className="number" data-val="1">
        1
      </button>
      <button id="two" className="number" data-val="2">
        2
      </button>
      <button id="three" className="number" data-val="3">
        3
      </button>
      <button id="zero" className="number" data-val="0">
        0
      </button>
      <button id="add" className="operation" data-val="+">
        +
      </button>
      <button id="subtract" className="operation" data-val="-">
        -
      </button>
      <button id="multiply" className="operation" data-val="*">
        *
      </button>
      <button id="divide" className="operation" data-val="/">
        /
      </button>
      <button id="decimal" className="number" data-val=".">
        .
      </button>
      <button id="equals">=</button>
    </div>
  );
}

function Calculator() {
  const [formula, setFormula] = React.useState("");
  const [display, setDisplay] = React.useState("0");
  const [result, setResult] = React.useState(null);
  const [lastIn, setLastIn] = React.useState(null);

  const invalid = "Invalid formula";

  const numRegEx = /[\d.]/;
  const operationRegEx = /-*\/+/;
  const symbolRegEx = /[^0-9.]/;
  const twoOperationsRegEx = /[-*/+][*/+]/;

  function clearResult() {
    setResult(null);
  }

  function calculateResult() {
    try {
      //substitute multiple operators for one operator
      let subFormula = formula;
      let opInd = subFormula.search(twoOperationsRegEx);
      while (opInd >= 0) {
        subFormula =
          subFormula.substring(0, opInd) + subFormula.substring(opInd + 1);
        opInd = subFormula.search(twoOperationsRegEx);
      }

      //calculate result
      const calcResult = eval(subFormula);
      //round the result to a certain number of decimal points (3 or 4)

      //if the calculation worked, set values
      if (!isNaN(calcResult)) {
        setFormula(formula.concat(`=${calcResult}`));
        setResult(calcResult);
      }
    } catch (error) {
      //if there were errors thrown for any reason, return an invalid string
      setResult(invalid);
    }
  }

  //clear all values
  function clear() {
    setFormula("");
    setDisplay("0");
    clearResult();
    setLastIn(null);
  }

  function addToFormula(target) {
    const val = target.dataset.val;

    //parse last number
    const vals = formula.split(symbolRegEx);
    let lastNum = vals[vals.length - 1];
    if (lastNum) {
      //check for existing decimal in recent number
      if (val === "." && /\./.test(lastNum)) {
        return;
      }
      //parse to ensure that we can properly check for 0
      lastNum = parseFloat(lastNum);
      //check for leading zeros
      if (lastNum === 0) {
        if (val === "0") {
          return;
        } else if (!operationRegEx.test(val)) {
          setFormula(formula.slice(0, formula.length - 2).concat(val));
          setDisplay(val);
          setLastIn(val);
          return;
        }
      }
    }

    //handle previous invalid inputs
    if (result === invalid) {
      clearResult();
      setFormula(val);
      return;
    }

    //handle display changes
    if (target.classList.contains("operation")) {
      setDisplay(val);
    }

    if (target.classList.contains("number")) {
      if (numRegEx.test(lastIn)) {
        setDisplay(display.concat(val));
      } else {
        setDisplay(val);
      }
    }

    //handle recent results
    if (result) {
      if (target.classList.contains("operation")) {
        setFormula(`${result}`.concat(val)); // continue evaluation with the most recent result if using an operator
      }
      if (target.classList.contains("number")) {
        setFormula(val); //start a new calc if starting with a number
      }
      clearResult();
      // update last in
      setLastIn(val);
      return;
    }

    // update last in
    setLastIn(val);

    //set formula with new values
    setFormula(formula.concat(val));
  }

  function onButtonClick(e) {
    e.preventDefault();
    const target = e.target;
    if (target.localName !== "button") return; //making sure we don't try to fire events when you miss a button

    if (
      target.classList.contains("number") ||
      target.classList.contains("operation")
    ) {
      addToFormula(target);
    }

    if (target.id === "clear") {
      clear();
    }

    if (target.id === "equals") {
      calculateResult();
    }
  }

  return (
    <div id="app-container" className="m-auto col-4">
      <h1 className="text-center">JS Calculator</h1>
      <div id="calculator-container">
        <p id="formula">{formula}</p>
        <p id="display">{result ?? display}</p>
        <Buttons onButtonClick={onButtonClick} />
      </div>
    </div>
  );
}

export default Calculator;
