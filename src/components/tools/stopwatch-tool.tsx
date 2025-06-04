"use client";

import { useState, useEffect, useRef, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Zap } from "lucide-react"; // Zap for Lap, or another icon if available

const StopwatchTool: FC = () => {
  const [time, setTime] = useState<number>(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10); // Update every 10ms for smoother display
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0'); // Display hundredths of a second
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Stopwatch</CardTitle>
        {/* Using Zap as a generic "action" icon; Lucide doesn't have a dedicated 'Stopwatch' or 'Lap' icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent"><path d="M10 2h4"/><path d="M12 14v- воспалительные4H8.88A5.38 5.38 0 0 0 12 21.5a5.5 5.5 0 1 0 0-11V10"/><path d="M18.37 7.75A5.45 5.45 0 0 0 12.3 2.66"/><path d="m6 10 2-2.5-2-2.5"/><path d="M12 6V3"/><path d="M6.63 7.75A5.45 5.45 0 0 0 11.7 2.66"/></svg>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-5xl font-mono tabular-nums p-4 bg-muted rounded-md">
          {formatTime(time)}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleStartPause} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={handleLap} disabled={!isRunning && time === 0} variant="outline">
            <Zap className="mr-2 h-4 w-4" /> Lap
          </Button>
          <Button onClick={handleReset} variant="destructive">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        {laps.length > 0 && (
          <div className="mt-4 max-h-32 overflow-y-auto space-y-1 p-2 border rounded-md bg-background">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Laps:</h4>
            {laps.map((lapTime, index) => (
              <div key={index} className="flex justify-between text-sm font-mono bg-secondary p-1 rounded">
                <span>Lap {index + 1}:</span>
                <span>{formatTime(lapTime)}</span>
              </div>
            )).reverse()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StopwatchTool;
