"use client";

import { useState, useEffect, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LevelerTool: FC = () => {
  const [tiltX, setTiltX] = useState(0); // For bubble position: -50 (left) to 50 (right)
  const [tiltY, setTiltY] = useState(0); // For bubble position: -50 (top) to 50 (bottom)
  const { toast } = useToast();
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermissions = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleMotionEvent);
          setPermissionGranted(true);
        } else {
          toast({ title: "Permission Denied", description: "Device motion permission was not granted.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Permission Error", description: "Error requesting device motion permission.", variant: "destructive" });
      }
    } else {
      // For browsers that don't require explicit permission
      window.addEventListener('devicemotion', handleMotionEvent);
      setPermissionGranted(true); // Assume granted if no explicit request needed
    }
  };
  
  useEffect(() => {
    // Request permission on component mount for iOS
    // For other browsers, it might just work or fail silently if not HTTPS
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      requestPermissions();
    } else {
        toast({
          title: "Device Motion Not Supported",
          description: "Your browser or device does not support device motion events.",
          variant: "destructive"
        });
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, []);


  const handleMotionEvent = (event: DeviceMotionEvent) => {
    if (event.accelerationIncludingGravity) {
      const { x, y } = event.accelerationIncludingGravity;
      // Basic tilt calculation (simplified)
      // Normalize and scale for bubble movement. Max g is ~9.8.
      // Let's cap visual movement to a range, e.g., map +/- 5 m/s^2 to +/- 40% of container.
      if (x !== null && y !== null) {
        const newTiltX = Math.max(-1, Math.min(1, x / 5)) * 40; // percentage of movement
        const newTiltY = Math.max(-1, Math.min(1, y / 5)) * 40;
        setTiltX(-newTiltX); // Invert X for natural bubble movement
        setTiltY(newTiltY);
      }
    }
  };
  
  const isLevel = Math.abs(tiltX) < 5 && Math.abs(tiltY) < 5;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Leveler</CardTitle>
        <Gauge className={`h-6 w-6 ${isLevel ? 'text-green-500' : 'text-accent'}`} />
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className="w-48 h-48 bg-muted rounded-full border-4 border-foreground/50 flex items-center justify-center relative overflow-hidden my-4">
          {/* Crosshairs */}
          <div className="absolute w-full h-px bg-foreground/30 top-1/2 left-0 -translate-y-1/2"></div>
          <div className="absolute h-full w-px bg-foreground/30 left-1/2 top-0 -translate-x-1/2"></div>
          
          {/* Bubble */}
          <div 
            className="w-8 h-8 bg-accent rounded-full border-2 border-accent-foreground shadow-lg transition-transform duration-100 ease-linear"
            style={{ transform: `translate(${tiltX}%, ${tiltY}%)` }}
          ></div>
        </div>
        <p className={`text-lg font-semibold ${isLevel ? 'text-green-600' : 'text-destructive'}`}>
          {isLevel ? "Surface is Level" : "Surface is Not Level"}
        </p>
        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 w-full max-w-xs">
            <p>Horizontal Tilt: {tiltX.toFixed(1)}°</p>
            <p>Vertical Tilt: {tiltY.toFixed(1)}°</p>
        </div>
        {!permissionGranted && (
          <Button onClick={requestPermissions} variant="outline" className="mt-2">
            Enable Motion Sensors
          </Button>
        )}
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>Uses device motion sensors. Accuracy may vary. Ensure your device is on a flat surface for calibration if needed (not implemented here). May require permissions on some devices/browsers (e.g., iOS).</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelerTool;
