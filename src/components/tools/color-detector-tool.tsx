
"use client";

import { useState, useEffect, useRef, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Palette, Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColorDetectorTool: FC = () => {
  const [detectedColor, setDetectedColor] = useState<string>("#FFFFFF"); // Default to white
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const startColorDetection = () => {
    toast({
      title: "Color Detection (Placeholder)",
      description: "Actual color detection from camera feed requires image processing logic.",
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
        <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center relative overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
           {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <Camera className="h-16 w-16 text-white mb-2" />
              <p className="text-white">Requesting camera access...</p>
            </div>
          )}
          <div 
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full border-2 border-card shadow-lg"
            style={{ backgroundColor: detectedColor }}
            title={`Detected color: ${detectedColor}`}
          ></div>
        </div>

        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Camera permission was denied or is unavailable. Please check your browser settings.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <Label htmlFor="detectedColorValue" className="shrink-0">Detected Color:</Label>
          <Input id="detectedColorValue" type="text" value={detectedColor} readOnly className="font-mono"/>
          <div className="w-8 h-8 rounded border" style={{ backgroundColor: detectedColor }}></div>
        </div>
        <Button onClick={startColorDetection} className="w-full" disabled={hasCameraPermission !== true}>
          Detect Color from Camera
        </Button>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool uses your device's camera. Actual color detection requires image analysis logic.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorDetectorTool;
