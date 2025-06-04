"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler as RulerIcon } from "lucide-react";

const RulerTool: FC = () => {
  // This is a visual representation. Actual screen PPI is needed for accuracy.
  // For simplicity, we'll make a fixed-size ruler with relative markings.
  // One inch is approximately 96 CSS pixels on many screens, but this varies.
  // We'll assume 100px = some arbitrary unit like "Units" or "cm (approx)".
  const pixelsPerUnit = 50; // 1 unit = 50px
  const totalUnits = 6; // Total units to display

  const renderTicks = (lengthInPixels: number, mainTicks: number) => {
    const ticks = [];
    const pixelsPerMainTick = lengthInPixels / mainTicks;

    for (let i = 0; i <= mainTicks; i++) {
      const pos = i * pixelsPerMainTick;
      // Main tick
      ticks.push(
        <div key={`main-${i}`} className="absolute bg-foreground" style={{ left: `${pos}px`, top: 0, width: '2px', height: '20px' }}>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs">{i}</span>
        </div>
      );
      if (i < mainTicks) {
        // Half tick
        ticks.push(
          <div key={`half-${i}`} className="absolute bg-foreground/70" style={{ left: `${pos + pixelsPerMainTick / 2}px`, top: 0, width: '1px', height: '12px' }}></div>
        );
        // Quarter ticks
        ticks.push(
          <div key={`q1-${i}`} className="absolute bg-foreground/50" style={{ left: `${pos + pixelsPerMainTick / 4}px`, top: 0, width: '1px', height: '8px' }}></div>
        );
        ticks.push(
          <div key={`q3-${i}`} className="absolute bg-foreground/50" style={{ left: `${pos + (pixelsPerMainTick * 3) / 4}px`, top: 0, width: '1px', height: '8px' }}></div>
        );
      }
    }
    return ticks;
  };
  
  const rulerLengthPixels = pixelsPerUnit * totalUnits;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Ruler</CardTitle>
        <RulerIcon className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        <p className="text-sm text-muted-foreground">Note: This ruler is for approximate measurements. Accuracy depends on your screen's pixel density (PPI).</p>
        <div className="bg-muted p-2 rounded-md select-none overflow-x-auto">
          <div className="relative h-10 border-b-2 border-foreground" style={{ width: `${rulerLengthPixels + 2}px` }}> {/* +2 for border thickness */}
            {renderTicks(rulerLengthPixels, totalUnits)}
          </div>
          <p className="text-xs text-center mt-2 text-muted-foreground">Units (approx. cm)</p>
        </div>

        <div className="bg-muted p-2 rounded-md select-none mt-4 overflow-x-auto">
          <div className="relative w-10 border-r-2 border-foreground" style={{ height: `${rulerLengthPixels + 2}px` }}>
             {/* Vertical Ruler Ticks (Simplified) */}
            {Array.from({ length: totalUnits + 1 }).map((_, i) => (
              <div key={`v-main-${i}`} className="absolute bg-foreground" style={{ top: `${i * pixelsPerUnit}px`, left: 0, height: '2px', width: '20px' }}>
                <span className="absolute -right-5 top-1/2 -translate-y-1/2 text-xs">{i}</span>
              </div>
            ))}
          </div>
           <p className="text-xs text-center mt-2 text-muted-foreground">Units (approx. cm)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulerTool;
