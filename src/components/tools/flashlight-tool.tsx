"use client";

import { useState, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FlashlightTool: FC = () => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);

  const toggleFlashlight = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Unsupported Browser",
        description: "Flashlight control is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isOn) {
        // Turn off
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setIsOn(false);
        toast({ title: "Flashlight Off" });
      } else {
        // Turn on
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
          }
        });
        const track = mediaStream.getVideoTracks()[0];
        if (track && typeof track.applyConstraints === 'function') {
          await track.applyConstraints({ advanced: [{ torch: true }] });
          setStream(mediaStream);
          setIsOn(true);
          toast({ title: "Flashlight On" });
        } else {
          toast({
            title: "Flashlight Error",
            description: "Could not access torch functionality.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Flashlight error:", err);
      let description = "Could not access the camera or flashlight. Please check permissions.";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          description = "Camera permission denied. Flashlight requires camera access.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          description = "No suitable camera found for flashlight.";
        } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
           description = "Flashlight (torch) not supported on this camera/device.";
        }
      }
      toast({
        title: "Flashlight Error",
        description: description,
        variant: "destructive",
      });
      if (stream) { // clean up stream if error occurred during turn on
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsOn(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Flashlight</CardTitle>
        <Zap className={`h-6 w-6 ${isOn ? 'text-yellow-400 fill-yellow-400' : 'text-accent'}`} />
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center my-4 transition-colors duration-300 ${isOn ? 'bg-yellow-300' : 'bg-muted'}`}>
          <Zap className={`h-12 w-12 transition-colors duration-300 ${isOn ? 'text-yellow-600' : 'text-muted-foreground'}`} />
        </div>
        <Button onClick={toggleFlashlight} className="w-full">
          {isOn ? "Turn Off" : "Turn On"}
        </Button>
        <div className="flex items-center text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
          <p>Uses device camera flash. Availability depends on your device and browser support for torch control.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashlightTool;
