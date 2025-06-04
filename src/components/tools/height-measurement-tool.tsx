"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveVertical, AlertTriangle } from "lucide-react";

const HeightMeasurementTool: FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Height Measurement</CardTitle>
        <MoveVertical className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center p-4">
          <Image 
            src="https://placehold.co/300x200.png" 
            alt="Height measurement concept" 
            width={200} 
            height={150} 
            className="rounded"
            data-ai-hint="measurement person"
          />
          <p className="text-muted-foreground text-center mt-2 text-sm">
            Conceptual representation of height measurement.
          </p>
        </div>
        <div className="flex items-start text-sm text-muted-foreground p-3 bg-muted rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-destructive" />
          <p>Estimating height typically requires advanced device sensors (like ARKit/ARCore) and camera access. This is a placeholder for a complex feature.</p>
        </div>
        <p className="text-center text-lg font-semibold text-primary">Feature Coming Soon!</p>
      </CardContent>
    </Card>
  );
};

export default HeightMeasurementTool;
