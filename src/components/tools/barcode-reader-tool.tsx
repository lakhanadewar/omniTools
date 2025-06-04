
"use client";

import { useState, useEffect, useRef, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanLine, Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BarcodeReaderTool: FC = () => {
  const [scannedData, setScannedData] = useState<string>("");
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

  const startScanning = () => {
    toast({
      title: "Barcode Scanning (Placeholder)",
      description: "Actual barcode scanning from the camera feed requires a dedicated library.",
    });
    // Simulate a scan if needed for placeholder
    setScannedData(`SimulatedScan-${Date.now()}`);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Barcode Reader</CardTitle>
        <ScanLine className="h-6 w-6 text-accent" />
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
           <div className="absolute top-1/2 left-0 w-full h-1 bg-accent/50 animate-pulse" style={{ transform: 'translateY(-50%)' }}></div>
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

        <div>
          <Label htmlFor="scannedData">Scanned Data</Label>
          <Input id="scannedData" type="text" value={scannedData} readOnly placeholder="Barcode data will appear here" />
        </div>
        <Button onClick={startScanning} className="w-full" disabled={hasCameraPermission !== true}>
          Scan Barcode
        </Button>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
         <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool uses your device's camera. Actual barcode scanning requires a barcode scanning library.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeReaderTool;
