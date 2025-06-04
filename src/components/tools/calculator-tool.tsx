"use client";

import { useState, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator as CalculatorIcon, Delete } from "lucide-react"; // Delete for backspace

const CalculatorTool: FC = () => {
  const [display, setDisplay] = useState<string>("0");
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };
  
  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setDisplay(String(result));
      setCurrentValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prevValue: number, nextValue: number, op: string): number => {
    switch (op) {
      case "+": return prevValue + nextValue;
      case "-": return prevValue - nextValue;
      case "*": return prevValue * nextValue;
      case "/": return nextValue === 0 ? NaN : prevValue / nextValue; // Handle division by zero
      default: return nextValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (currentValue !== null && operator) {
      const result = calculate(currentValue, inputValue, operator);
      if (isNaN(result)) {
         setDisplay("Error");
      } else {
         setDisplay(String(result));
      }
      setCurrentValue(null); // Allow new calculation chain
      setOperator(null);
      setWaitingForOperand(true); // Ready for new number input
    }
  };

  const buttons = [
    { label: "AC", action: clearDisplay, className: "col-span-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground" },
    { label: <Delete />, action: backspace, className: "bg-secondary hover:bg-secondary/80" },
    { label: "/", action: () => performOperation("/"), className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
    { label: "7", action: () => inputDigit("7") }, { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") }, { label: "*", action: () => performOperation("*"), className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
    { label: "4", action: () => inputDigit("4") }, { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") }, { label: "-", action: () => performOperation("-"), className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
    { label: "1", action: () => inputDigit("1") }, { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") }, { label: "+", action: () => performOperation("+"), className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
    { label: "0", action: () => inputDigit("0"), className: "col-span-2" },
    { label: ".", action: inputDecimal },
    { label: "=", action: handleEquals, className: "bg-primary hover:bg-primary/90 text-primary-foreground" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Calculator</CardTitle>
        <CalculatorIcon className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          type="text" 
          value={display} 
          readOnly 
          className="h-16 text-4xl text-right font-mono tabular-nums pr-4 bg-muted"
          aria-label="Calculator display"
        />
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={btn.action}
              variant={btn.className?.includes("bg-") ? "default" : "outline"} // Heuristic for styling
              className={`h-16 text-xl ${btn.className || ''}`}
              aria-label={typeof btn.label === 'string' ? btn.label : 'calculator button'}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorTool;
