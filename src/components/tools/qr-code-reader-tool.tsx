
"use client";

import { useState, useEffect, useRef, type FC, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanLine, Camera, AlertTriangle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';

const QRCodeReaderTool: FC = () => {
  const [scannedData, setScannedData] = useState<string>("");
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isReaderInitialized, setIsReaderInitialized] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    if (reader && typeof reader.decodeOnceFromVideoElement === 'function') {
      codeReaderRef.current = reader;
      setIsReaderInitialized(true);
    } else {
      console.error('Failed to initialize BrowserMultiFormatReader or decodeOnceFromVideoElement is missing.');
      setIsReaderInitialized(false);
      toast({
        variant: 'destructive',
        title: 'QR Reader Error',
        description: 'The QR code reader could not be set up correctly. Please try refreshing the page.',
      });
    }

    return () => {
      if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
        codeReaderRef.current.reset();
      } else if (codeReaderRef.current) {
         console.warn('[QRCodeReaderTool] codeReaderRef.current.reset is not a function during main effect cleanup. Current ref:', codeReaderRef.current);
      }
    };
  }, [toast]);

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
      // The reset for codeReaderRef is handled in its own initialization effect's cleanup
    };
  }, [toast]);

  const startScanning = useCallback(async () => {
    if (!isReaderInitialized || !videoRef.current || !codeReaderRef.current || hasCameraPermission !== true) {
      toast({
        title: "Scanning Error",
        description: "Camera not ready, permissions not granted, or QR reader not initialized.",
        variant: "destructive",
      });
      return;
    }
    
    setScannedData(""); 
    setIsScanning(true);
    toast({ title: "Scanning for QR Code...", description: "Attempting to read QR code." });

    try {
      // isReaderInitialized ensures codeReaderRef.current and its method are valid
      const result = await codeReaderRef.current.decodeOnceFromVideoElement(videoRef.current);
      if (result) {
        setScannedData(result.getText());
        toast({
          title: "QR Code Scanned!",
          description: `Data: ${result.getText()}`,
        });
      } else {
        // This case might not be hit if NotFoundException is thrown for no QR code
        setScannedData("No QR code found (decode result was empty).");
         toast({
          title: "Scan Complete",
          description: "No QR code was detected (decode result was empty).",
          variant: "default" 
        });
      }
    } catch (error) {
      console.error("QR Code scanning error:", error);
      if (error instanceof NotFoundException) {
        setScannedData("No QR code found.");
        toast({
          title: "Scan Complete",
          description: "No QR code was detected.",
        });
      } else if (error instanceof Error) {
        setScannedData(`Error: ${error.message}`);
        toast({
          title: "Scanning Error",
          description: error.message || "An error occurred while trying to scan.",
          variant: "destructive",
        });
      } else {
        setScannedData("Error scanning QR code.");
        toast({
          title: "Scanning Error",
          description: "An unknown error occurred while trying to scan.",
          variant: "destructive",
        });
      }
    } finally {
      setIsScanning(false);
    }
  }, [hasCameraPermission, toast, isReaderInitialized]);

  const resetScanner = () => {
    setScannedData("");
    setIsScanning(false);
    if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
      codeReaderRef.current.reset();
    } else if (codeReaderRef.current) {
      console.warn('[QRCodeReaderTool] codeReaderRef.current.reset is not a function in resetScanner. Current ref:', codeReaderRef.current);
    }
    // Ensure video feed continues if camera permission is still granted
    if (videoRef.current && hasCameraPermission && videoRef.current.paused && videoRef.current.srcObject) {
        videoRef.current.play().catch(err => console.error("Error restarting video playback after reset:", err));
    }
    toast({ title: "Scanner Reset", description: "Ready for a new scan." });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">QR Code Reader</CardTitle>
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

        {!isReaderInitialized && hasCameraPermission === true && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>QR Reader Initialization Failed</AlertTitle>
            <AlertDescription>
              The QR code reader component could not be set up. You might need to refresh the page.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="scannedQrData">Scanned Data</Label>
          <Input id="scannedQrData" type="text" value={scannedData} readOnly placeholder="QR code data will appear here" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={startScanning} 
            className="w-full" 
            disabled={hasCameraPermission !== true || isScanning || !isReaderInitialized}
          >
            {isScanning ? "Scanning..." : "Scan QR Code"}
          </Button>
          <Button onClick={resetScanner} variant="outline" disabled={isScanning}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
         <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool uses your device's camera and @zxing/library for QR code detection.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeReaderTool;
