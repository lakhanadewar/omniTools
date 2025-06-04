"use client";

import { useState, useEffect, useRef, type FC } from 'react';
import * as Tone from 'tone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const TimerTool: FC = () => {
  const [initialMinutes, setInitialMinutes] = useState<string>("5");
  const [initialSeconds, setInitialSeconds] = useState<string>("0");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const audioContextStartedRef = useRef(false);

  const ensureAudioContext = async () => {
    if (Tone.context.state !== 'running' && !audioContextStartedRef.current) {
      await Tone.start();
      audioContextStartedRef.current = true;
    }
  };

  const playAlertSound = async () => {
    await ensureAudioContext();
    try {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("C5", "0.5s", Tone.now());
      synth.triggerAttackRelease("G5", "0.5s", Tone.now() + 0.5);
    } catch (error) {
      console.error("Error playing sound:", error);
      toast({
        title: "Audio Error",
        description: "Could not play alert sound. Please interact with the page first.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playAlertSound();
      toast({
        title: "Timer Finished!",
        description: "Time is up!",
      });
    }
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isRunning, timeLeft, toast]);

  const handleStart = async () => {
    await ensureAudioContext();
    const minutes = parseInt(initialMinutes, 10) || 0;
    const seconds = parseInt(initialSeconds, 10) || 0;
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    } else {
       toast({ title: "Invalid Time", description: "Please set a valid time.", variant: "destructive" });
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setTimeLeft(0);
    setInitialMinutes("5");
    setInitialSeconds("0");
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Timer</CardTitle>
        <Timer className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minutes">Minutes</Label>
            <Input id="minutes" type="number" value={initialMinutes} onChange={(e) => setInitialMinutes(e.target.value)} placeholder="MM" disabled={isRunning || timeLeft > 0} />
          </div>
          <div>
            <Label htmlFor="seconds">Seconds</Label>
            <Input id="seconds" type="number" value={initialSeconds} onChange={(e) => setInitialSeconds(e.target.value)} placeholder="SS" disabled={isRunning || timeLeft > 0} />
          </div>
        </div>
        <div className="text-center text-5xl font-mono tabular-nums p-4 bg-muted rounded-md">
          {formatTime(timeLeft)}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleStart} disabled={isRunning || (parseInt(initialMinutes,10) === 0 && parseInt(initialSeconds,10) === 0)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button onClick={handlePause} disabled={!isRunning} variant="outline">
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
          <Button onClick={handleReset} variant="destructive">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerTool;
