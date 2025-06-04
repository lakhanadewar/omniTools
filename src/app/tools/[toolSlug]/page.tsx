
"use client";

import type { NextPage } from 'next';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { AppHeader } from "@/components/layout/app-header";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import UnitConverterTool from "@/components/tools/unit-converter-tool";
import AreaConverterTool from "@/components/tools/area-converter-tool";
import VolumeCalculatorTool from "@/components/tools/volume-calculator-tool";
import CalculatorTool from "@/components/tools/calculator-tool";
import TimerTool from "@/components/tools/timer-tool";
import StopwatchTool from "@/components/tools/stopwatch-tool";
import RulerTool from "@/components/tools/ruler-tool";
import LevelerTool from "@/components/tools/leveler-tool";
import HeightMeasurementTool from "@/components/tools/height-measurement-tool";
import FlashlightTool from "@/components/tools/flashlight-tool";
import QRCodeGeneratorTool from "@/components/tools/qr-code-generator-tool";
import MagnifierTool from "@/components/tools/magnifier-tool";
import ColorDetectorTool from "@/components/tools/color-detector-tool";
import QRCodeReaderTool from "@/components/tools/qr-code-reader-tool";

import { TOOLS_CONFIG_WITH_DETAILS, type ToolDetails } from '@/lib/tools';

const toolComponentMap: Record<string, React.FC<any>> = {
  'unit-converter': UnitConverterTool,
  'area-converter': AreaConverterTool,
  'volume-calculator': VolumeCalculatorTool,
  'calculator': CalculatorTool,
  'timer': TimerTool,
  'stopwatch': StopwatchTool,
  'ruler': RulerTool,
  'leveler': LevelerTool,
  'height-measurement': HeightMeasurementTool,
  'flashlight': FlashlightTool,
  'qr-code-generator': QRCodeGeneratorTool,
  'magnifier': MagnifierTool,
  'color-detector': ColorDetectorTool,
  'qr-code-reader': QRCodeReaderTool,
};

const ToolPage: NextPage = () => {
  const params = useParams();
  const router = useRouter();
  const toolSlug = params.toolSlug as string;
  const [toolDetails, setToolDetails] = useState<ToolDetails | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (toolSlug) {
      const details = TOOLS_CONFIG_WITH_DETAILS.find(t => t.id === toolSlug);
      if (details) {
        setToolDetails(details);
      } else {
        console.error(`Tool with slug "${toolSlug}" not found.`);
        // Optionally redirect to a 404 page or home
        // router.push('/404'); 
      }
    }
  }, [toolSlug, router]);

  const ToolComponent = toolSlug ? toolComponentMap[toolSlug] : null;

  if (!isClient) {
     return (
       <div className="flex min-h-screen flex-col">
         <AppHeader />
         <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
           <p>Loading page...</p>
         </main>
       </div>
     );
  }

  if (!toolSlug || !ToolComponent || !toolDetails) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground mb-6">The tool you are looking for does not exist or could not be loaded.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
                <ArrowLeft />
                <span className="sr-only">Back to Home</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline text-primary">{toolDetails.name}</h1>
        </div>
        <div className="max-w-lg mx-auto bg-card p-6 rounded-lg shadow-lg">
          <ToolComponent />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {toolDetails.name} - OmniTool. All rights reserved.
      </footer>
    </div>
  );
};

export default ToolPage;
