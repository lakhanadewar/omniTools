
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

const BarcodeReaderTool: FC = () => {
  const [scannedData, setScannedData] = useState<string>("");
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
        codeReaderRef.current.reset();
      } else if (codeReaderRef.current) {
        console.warn('[BarcodeReaderTool] codeReaderRef.current.reset is not a function during main effect cleanup. Current ref:', codeReaderRef.current);
      }
    };
  }, []);

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
      if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
        codeReaderRef.current.reset();
      } else if (codeReaderRef.current) {
         console.warn('[BarcodeReaderTool] codeReaderRef.current.reset is not a function during camera effect cleanup. Current ref:', codeReaderRef.current);
      }
    };
  }, [toast]);

  const startScanning = useCallback(async () => {
    if (!videoRef.current || !codeReaderRef.current || hasCameraPermission !== true) {
      toast({
        title: "Scanning Error",
        description: "Camera not ready or permissions not granted.",
        variant: "destructive",
      });
      return;
    }
    
    setScannedData(""); 
    setIsScanning(true);
    toast({ title: "Scanning...", description: "Attempting to read barcode." });

    try {
      // Ensure codeReaderRef.current exists and has decodeOnceFromVideoElement method
      if (codeReaderRef.current && typeof codeReaderRef.current.decodeOnceFromVideoElement === 'function') {
        const result = await codeReaderRef.current.decodeOnceFromVideoElement(videoRef.current);
        if (result) {
          setScannedData(result.getText());
          toast({
            title: "Barcode Scanned!",
            description: `Data: ${result.getText()}`,
          });
        } else {
          setScannedData("No barcode found.");
           toast({
            title: "Scan Complete",
            description: "No barcode was detected.",
            variant: "default" 
          });
        }
      } else {
        throw new Error("Barcode reader is not properly initialized.");
      }
    } catch (error) {
      console.error("Barcode scanning error:", error);
      if (error instanceof NotFoundException) {
        setScannedData("No barcode found.");
        toast({
          title: "Scan Complete",
          description: "No barcode was detected.",
        });
      } else if (error instanceof Error) {
        setScannedData(`Error: ${error.message}`);
        toast({
          title: "Scanning Error",
          description: error.message || "An error occurred while trying to scan.",
          variant: "destructive",
        });
      } else {
        setScannedData("Error scanning barcode.");
        toast({
          title: "Scanning Error",
          description: "An unknown error occurred while trying to scan.",
          variant: "destructive",
        });
      }
    } finally {
      setIsScanning(false);
    }
  }, [hasCameraPermission, toast]);

  const resetScanner = () => {
    setScannedData("");
    setIsScanning(false);
    if (codeReaderRef.current && typeof codeReaderRef.current.reset === 'function') {
      codeReaderRef.current.reset();
    } else if (codeReaderRef.current) {
      console.warn('[BarcodeReaderTool] codeReaderRef.current.reset is not a function in resetScanner. Current ref:', codeReaderRef.current);
    }
    toast({ title: "Scanner Reset", description: "Ready for a new scan." });
  }

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
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={startScanning} className="w-full" disabled={hasCameraPermission !== true || isScanning}>
            {isScanning ? "Scanning..." : "Scan Barcode"}
          </Button>
          <Button onClick={resetScanner} variant="outline" disabled={isScanning}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
         <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>This tool uses your device's camera and @zxing/browser library for barcode detection.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeReaderTool;
