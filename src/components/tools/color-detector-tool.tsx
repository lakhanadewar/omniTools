"use client";

import { useState, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Palette, Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColorDetectorTool: FC = () => {
  const [detectedColor, setDetectedColor] = useState<string>("#FFFFFF"); // Default to white
  const { toast } = useToast();

  const startColorDetection = () => {
    toast({
      title: "Color Detector (Placeholder)",
      description: "This feature requires camera access to detect colors. Implementation is pending.",
    });
    // Simulate color detection for placeholder
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setDetectedColor(randomColor);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Color Detector</CardTitle>
        <Palette className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center relative">
          <Camera className="h-16 w-16 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Camera feed placeholder</p>
          <div 
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full border-2 border-card"
            style={{ backgroundColor: detectedColor }}
            title={`Detected color: ${detectedColor}`}
          ></div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="detectedColorValue" className="shrink-0">Detected Color:</Label>
          <Input id="detectedColorValue" type="text" value={detectedColor} readOnly className="font-mono"/>
          <div className="w-8 h-8 rounded border" style={{ backgroundColor: detectedColor }}></div>
        </div>
        <Button onClick={startColorDetection} className="w-full">
          Detect Color from Camera
        </Button>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool will use your device's camera to identify colors. Actual implementation requires camera API integration and color analysis logic.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorDetectorTool;
