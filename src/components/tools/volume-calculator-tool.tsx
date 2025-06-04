"use client";

import { useState, type ChangeEvent, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";

type Shape = "cube" | "cuboid" | "cylinder" | "sphere" | "cone";

const VolumeCalculatorTool: FC = () => {
  const [shape, setShape] = useState<Shape>("cube");
  const [dimensions, setDimensions] = useState<Record<string, string>>({ side: "1" });
  const [volume, setVolume] = useState<string>("");

  const handleDimensionChange = (e: ChangeEvent<HTMLInputElement>, dim: string) => {
    setDimensions(prev => ({ ...prev, [dim]: e.target.value }));
  };

  const calculateVolume = () => {
    const parsedDimensions = Object.fromEntries(
      Object.entries(dimensions).map(([key, value]) => [key, parseFloat(value)])
    );

    let calculatedVolume: number | undefined;

    switch (shape) {
      case "cube":
        if (!isNaN(parsedDimensions.side)) calculatedVolume = Math.pow(parsedDimensions.side, 3);
        break;
      case "cuboid":
        if (!isNaN(parsedDimensions.length) && !isNaN(parsedDimensions.width) && !isNaN(parsedDimensions.height))
          calculatedVolume = parsedDimensions.length * parsedDimensions.width * parsedDimensions.height;
        break;
      case "cylinder":
        if (!isNaN(parsedDimensions.radius) && !isNaN(parsedDimensions.height))
          calculatedVolume = Math.PI * Math.pow(parsedDimensions.radius, 2) * parsedDimensions.height;
        break;
      case "sphere":
        if (!isNaN(parsedDimensions.radius))
          calculatedVolume = (4/3) * Math.PI * Math.pow(parsedDimensions.radius, 3);
        break;
      case "cone":
        if (!isNaN(parsedDimensions.radius) && !isNaN(parsedDimensions.height))
          calculatedVolume = (1/3) * Math.PI * Math.pow(parsedDimensions.radius, 2) * parsedDimensions.height;
        break;
    }

    if (calculatedVolume !== undefined) {
      setVolume(calculatedVolume.toFixed(4));
    } else {
      setVolume("Invalid dimensions");
    }
  };
  
  const resetDimensions = (newShape: Shape) => {
    setShape(newShape);
    setVolume("");
    switch (newShape) {
      case "cube": setDimensions({ side: "1" }); break;
      case "cuboid": setDimensions({ length: "1", width: "1", height: "1" }); break;
      case "cylinder": case "cone": setDimensions({ radius: "1", height: "1" }); break;
      case "sphere": setDimensions({ radius: "1" }); break;
      default: setDimensions({});
    }
  };

  const renderInputs = () => {
    switch (shape) {
      case "cube": return <InputFields fields={[{label: "Side", key: "side"}]} />;
      case "cuboid": return <InputFields fields={[{label: "Length", key: "length"}, {label: "Width", key: "width"}, {label: "Height", key: "height"}]} />;
      case "cylinder": case "cone": return <InputFields fields={[{label: "Radius", key: "radius"}, {label: "Height", key: "height"}]} />;
      case "sphere": return <InputFields fields={[{label: "Radius", key: "radius"}]} />;
      default: return null;
    }
  };

  const InputFields: FC<{fields: {label: string, key: string}[]}> = ({fields}) => (
    <>
      {fields.map(field => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input id={field.key} type="number" value={dimensions[field.key] || ""} onChange={(e) => handleDimensionChange(e, field.key)} placeholder={`Enter ${field.label.toLowerCase()}`} />
        </div>
      ))}
    </>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Volume Calculator</CardTitle>
        <Box className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="shape">Shape</Label>
          <Select value={shape} onValueChange={(value) => resetDimensions(value as Shape)}>
            <SelectTrigger id="shape"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cube">Cube</SelectItem>
              <SelectItem value="cuboid">Cuboid</SelectItem>
              <SelectItem value="cylinder">Cylinder</SelectItem>
              <SelectItem value="sphere">Sphere</SelectItem>
              <SelectItem value="cone">Cone</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputs()}
        </div>

        <Button onClick={calculateVolume} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Calculate Volume</Button>
        {volume && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-lg font-semibold text-secondary-foreground">Volume: <span className="text-accent">{volume}</span> cubic units</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VolumeCalculatorTool;
