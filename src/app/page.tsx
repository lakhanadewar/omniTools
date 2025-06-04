import { AppHeader } from "@/components/layout/app-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import BarcodeGeneratorTool from "@/components/tools/barcode-generator-tool";
import MagnifierTool from "@/components/tools/magnifier-tool";
import ColorDetectorTool from "@/components/tools/color-detector-tool";
import BarcodeReaderTool from "@/components/tools/barcode-reader-tool";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <Tabs defaultValue="converters-calculators" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="converters-calculators">Converters & Calculators</TabsTrigger>
            <TabsTrigger value="timers-measurement">Timers & Measurement</TabsTrigger>
            <TabsTrigger value="device-tools">Device Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="converters-calculators" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UnitConverterTool />
            <AreaConverterTool />
            <VolumeCalculatorTool />
            <CalculatorTool />
          </TabsContent>
          
          <TabsContent value="timers-measurement" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TimerTool />
            <StopwatchTool />
            <RulerTool />
            <LevelerTool />
            <HeightMeasurementTool />
          </TabsContent>
          
          <TabsContent value="device-tools" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FlashlightTool />
            <BarcodeGeneratorTool />
            <MagnifierTool />
            <ColorDetectorTool />
            <BarcodeReaderTool />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} OmniTool. All rights reserved.
      </footer>
    </div>
  );
}
