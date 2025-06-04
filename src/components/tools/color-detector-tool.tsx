
"use client";

import { useState, useEffect, useRef, type FC, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Palette, Camera, AlertTriangle, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColorDetectorTool: FC = () => {
  const [detectedColor, setDetectedColor] = useState<string>("#FFFFFF");
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const detectColor = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || hasCameraPermission !== true) {
      toast({
        title: "Detection Error",
        description: "Camera not ready or permissions not granted.",
        variant: "destructive",
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      toast({ title: "Canvas Error", description: "Could not get canvas context.", variant: "destructive" });
      return;
    }

    // Set canvas dimensions to match video to avoid distortion
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the color of the center pixel
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const pixelData = context.getImageData(centerX, centerY, 1, 1).data;

    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    // const a = pixelData[3]; // Alpha component, if needed

    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setDetectedColor(hexColor.toUpperCase());

    toast({
      title: "Color Detected!",
      description: `Hex: ${hexColor.toUpperCase()} | RGB: (${r},${g},${b})`,
    });

  }, [hasCameraPermission, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Color Detector</CardTitle>
        <Palette className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center relative overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          <canvas ref={canvasRef} className="hidden"></canvas> {/* Hidden canvas for processing */}
          
          {/* Reticle / Target Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Target className="h-8 w-8 text-accent opacity-75" />
          </div>

           {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <Camera className="h-16 w-16 text-white mb-2" />
              <p className="text-white">Requesting camera access...</p>
            </div>
          )}
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
        <Button onClick={detectColor} className="w-full" disabled={hasCameraPermission !== true}>
          Detect Color from Center
        </Button>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool uses your device's camera. It detects the color from the center of the video feed (marked by the target icon).</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorDetectorTool;
