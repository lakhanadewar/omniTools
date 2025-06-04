"use client";

import { useState, type ChangeEvent, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";

const unitCategories = {
  length: {
    name: "Length",
    units: { meter: "Meter (m)", kilometer: "Kilometer (km)", centimeter: "Centimeter (cm)", millimeter: "Millimeter (mm)", mile: "Mile (mi)", yard: "Yard (yd)", foot: "Foot (ft)", inch: "Inch (in)" },
    baseUnit: "meter",
    conversions: {
      meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254
    }
  },
  weight: {
    name: "Weight",
    units: { kilogram: "Kilogram (kg)", gram: "Gram (g)", milligram: "Milligram (mg)", pound: "Pound (lb)", ounce: "Ounce (oz)" },
    baseUnit: "kilogram",
    conversions: {
      kilogram: 1, gram: 0.001, milligram: 0.000001, pound: 0.453592, ounce: 0.0283495
    }
  },
  temperature: {
    name: "Temperature",
    units: { celsius: "Celsius (°C)", fahrenheit: "Fahrenheit (°F)", kelvin: "Kelvin (K)" },
    // Temperature conversion is special and not factor-based
  }
};

type UnitCategoryKey = keyof typeof unitCategories;

const UnitConverterTool: FC = () => {
  const [category, setCategory] = useState<UnitCategoryKey>("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>(unitCategories.length.baseUnit);
  const [toUnit, setToUnit] = useState<string>(Object.keys(unitCategories.length.units)[1] || unitCategories.length.baseUnit);
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Invalid input");
      return;
    }

    const selectedCategory = unitCategories[category];

    if (category === "temperature") {
      let convertedValue: number;
      if (fromUnit === "celsius") {
        if (toUnit === "fahrenheit") convertedValue = (value * 9/5) + 32;
        else if (toUnit === "kelvin") convertedValue = value + 273.15;
        else convertedValue = value;
      } else if (fromUnit === "fahrenheit") {
        if (toUnit === "celsius") convertedValue = (value - 32) * 5/9;
        else if (toUnit === "kelvin") convertedValue = ((value - 32) * 5/9) + 273.15;
        else convertedValue = value;
      } else if (fromUnit === "kelvin") {
        if (toUnit === "celsius") convertedValue = value - 273.15;
        else if (toUnit === "fahrenheit") convertedValue = ((value - 273.15) * 9/5) + 32;
        else convertedValue = value;
      } else {
        convertedValue = value;
      }
      setResult(convertedValue.toFixed(3));
    } else {
      const fromConversion = selectedCategory.conversions[fromUnit as keyof typeof selectedCategory.conversions];
      const toConversion = selectedCategory.conversions[toUnit as keyof typeof selectedCategory.conversions];
      const valueInBase = value * fromConversion;
      const convertedValue = valueInBase / toConversion;
      setResult(convertedValue.toFixed(5));
    }
  };

  const handleCategoryChange = (newCategory: UnitCategoryKey) => {
    setCategory(newCategory);
    const catDetails = unitCategories[newCategory];
    const unitKeys = Object.keys(catDetails.units);
    setFromUnit(catDetails.baseUnit || unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setResult("");
  };

  const currentUnits = unitCategories[category].units;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Unit Converter</CardTitle>
        <Scale className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(value) => handleCategoryChange(value as UnitCategoryKey)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(unitCategories).map(([key, cat]) => (
                <SelectItem key={key} value={key}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="inputValue">Value</Label>
          <Input id="inputValue" type="number" value={inputValue} onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} placeholder="Enter value" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromUnit">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger id="fromUnit"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(currentUnits).map(([key, name]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="toUnit">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger id="toUnit"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(currentUnits).map(([key, name]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleConvert} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Convert</Button>
        {result && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-lg font-semibold text-secondary-foreground">Result: <span className="text-accent">{result}</span></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitConverterTool;
