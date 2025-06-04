"use client";

import { useState, type ChangeEvent, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react"; // Using Square for Area

const areaUnits = {
  sqMeter: { name: "Square Meter (m²)", factor: 1 },
  sqKilometer: { name: "Square Kilometer (km²)", factor: 1000000 },
  sqCentimeter: { name: "Square Centimeter (cm²)", factor: 0.0001 },
  sqMillimeter: { name: "Square Millimeter (mm²)", factor: 0.000001 },
  hectare: { name: "Hectare (ha)", factor: 10000 },
  sqMile: { name: "Square Mile (mi²)", factor: 2589988.11 },
  sqYard: { name: "Square Yard (yd²)", factor: 0.836127 },
  sqFoot: { name: "Square Foot (ft²)", factor: 0.092903 },
  sqInch: { name: "Square Inch (in²)", factor: 0.00064516 },
  acre: { name: "Acre (ac)", factor: 4046.86 },
};

type AreaUnitKey = keyof typeof areaUnits;

const AreaConverterTool: FC = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<AreaUnitKey>("sqMeter");
  const [toUnit, setToUnit] = useState<AreaUnitKey>("sqFoot");
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Invalid input");
      return;
    }

    const valueInBaseUnit = value * areaUnits[fromUnit].factor;
    const convertedValue = valueInBaseUnit / areaUnits[toUnit].factor;
    setResult(convertedValue.toFixed(5));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Area Converter</CardTitle>
        <Square className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="areaInputValue">Value</Label>
          <Input id="areaInputValue" type="number" value={inputValue} onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} placeholder="Enter value" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="areaFromUnit">From</Label>
            <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as AreaUnitKey)}>
              <SelectTrigger id="areaFromUnit"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(areaUnits).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>{unit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="areaToUnit">To</Label>
            <Select value={toUnit} onValueChange={(value) => setToUnit(value as AreaUnitKey)}>
              <SelectTrigger id="areaToUnit"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(areaUnits).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>{unit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleConvert} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Convert Area</Button>
        {result && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-lg font-semibold text-secondary-foreground">Result: <span className="text-accent">{result}</span></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AreaConverterTool;
