
"use client";

import { useState, useEffect, useRef, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ZoomIn, Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MagnifierTool: FC = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const startMagnifier = () => {
    // Placeholder: In a real app, this might interact with canvas for zooming or apply digital zoom if supported.
    // For this example, we'll just cycle through some CSS zoom levels on the video element.
    const newZoomLevel = zoomLevel >= 3 ? 1 : zoomLevel + 0.5;
    setZoomLevel(newZoomLevel);
    if (videoRef.current) {
        videoRef.current.style.transform = `scale(${newZoomLevel})`;
    }
    toast({
      title: "Magnifier Zoom",
      description: `Zoom level: ${newZoomLevel}x. Actual advanced magnification may require more complex implementation.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Magnifier</CardTitle>
        <ZoomIn className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center overflow-hidden relative">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover transition-transform duration-300" 
            autoPlay 
            muted 
            playsInline 
            style={{ transform: `scale(${zoomLevel})` }}
          />
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
        
        <Button onClick={startMagnifier} className="w-full" disabled={hasCameraPermission !== true}>
          {zoomLevel > 1 ? `Zoom: ${zoomLevel}x (Click to cycle)` : "Toggle Zoom"}
        </Button>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool uses your device's camera. The zoom is a basic CSS scale. Advanced magnification may need canvas or other techniques.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MagnifierTool;
