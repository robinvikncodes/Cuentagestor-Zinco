import { useEffect, useState } from "react";
import React, { Component } from 'react'
import * as math from "mathjs";

const TextFieldCalculator = (props) => {
  const [expression, setExpression] = useState("");
  const [output, setOutput] = useState("");

  const handleKeyDown = (e) => {
    console.log(e.key);
    console.log(expression);
    if (
      (e.key >= "0" && e.key <= "9") ||
      ["+", "-", "*", "/", "."].includes(e.key)
    ) {
      setExpression(expression + e.key);
    } else if (e.key === "Backspace") {
      setExpression(expression.slice(0, -1));
    }
  };

  function getType(o) {
    return Object.prototype.toString
      .call(o)
      .match(/^\[object\s(.*)\]$/)[1]
      .toLowerCase();
  }

  function evaluateInput() {
    let result;
    try {
      result = math.evaluate(expression);
    } catch (e) {
      result = e;
    }
    let type = getType(result);
    // setError(type === "error");
    switch (type) {
      case "number":
      case "boolean":
        setOutput(result);
        props.setCalvalue(result)
        break;
      default:
        props.setCalvalue(0);
        break;
    }
  }

  useEffect(() => {
    evaluateInput();
  }, [expression]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Amount Here"
        className="bg-[#F6F6F6] text-[#6E88A6] font-[400] text-[19px] text-right w-full"
        value={expression}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </div>
  );
};

export default TextFieldCalculator;

export  class TextFieldCalculatorClass extends Component {
  render() {
    return (
      <div>Class</div>
    )
  }
}
