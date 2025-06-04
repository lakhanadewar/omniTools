
import type { LucideIcon } from 'lucide-react';
import {
  Scale, Square, Box, Calculator as CalculatorIcon, Timer, Clock as StopwatchIcon,
  Ruler as RulerIcon, Gauge, MoveVertical, Zap as FlashlightIcon, QrCode, ZoomIn, Palette, ScanLine
} from 'lucide-react';

export interface ToolCategory {
  id: string;
  name: string;
}

export const CATEGORIES: ToolCategory[] = [
  { id: 'converters-calculators', name: 'Converters & Calculators' },
  { id: 'measurement-utilities', name: 'Measurement & Utilities' },
  { id: 'camera-qr', name: 'Camera & QR Tools' },
  { id: 'time-management', name: 'Time Management' },
];

export interface ToolDetails {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  categoryId: string;
}

export const TOOLS_CONFIG_WITH_DETAILS: ToolDetails[] = [
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert various units of measurement.', icon: Scale, path: '/tools/unit-converter', categoryId: 'converters-calculators' },
  { id: 'area-converter', name: 'Area Converter', description: 'Convert between different area units.', icon: Square, path: '/tools/area-converter', categoryId: 'converters-calculators' },
  { id: 'volume-calculator', name: 'Volume Calculator', description: 'Calculate volumes of various shapes.', icon: Box, path: '/tools/volume-calculator', categoryId: 'converters-calculators' },
  { id: 'calculator', name: 'Calculator', description: 'Perform basic calculations.', icon: CalculatorIcon, path: '/tools/calculator', categoryId: 'converters-calculators' },
  { id: 'timer', name: 'Timer', description: 'Set countdown timers.', icon: Timer, path: '/tools/timer', categoryId: 'time-management' },
  { id: 'stopwatch', name: 'Stopwatch', description: 'Measure elapsed time with laps.', icon: StopwatchIcon, path: '/tools/stopwatch', categoryId: 'time-management' },
  { id: 'ruler', name: 'Ruler', description: 'On-screen ruler for approx. measurements.', icon: RulerIcon, path: '/tools/ruler', categoryId: 'measurement-utilities' },
  { id: 'leveler', name: 'Leveler', description: 'Use device sensors as a spirit level.', icon: Gauge, path: '/tools/leveler', categoryId: 'measurement-utilities' },
  { id: 'height-measurement', name: 'Height Measurement', description: 'Estimate height (conceptual).', icon: MoveVertical, path: '/tools/height-measurement', categoryId: 'measurement-utilities' },
  { id: 'flashlight', name: 'Flashlight', description: 'Use your device\'s camera flash.', icon: FlashlightIcon, path: '/tools/flashlight', categoryId: 'measurement-utilities' },
  { id: 'qr-code-generator', name: 'QR Code Generator', description: 'Create QR codes from text or URLs.', icon: QrCode, path: '/tools/qr-code-generator', categoryId: 'camera-qr' },
  { id: 'magnifier', name: 'Magnifier', description: 'Use your camera to magnify objects.', icon: ZoomIn, path: '/tools/magnifier', categoryId: 'camera-qr' },
  { id: 'color-detector', name: 'Color Detector', description: 'Detect colors using your camera.', icon: Palette, path: '/tools/color-detector', categoryId: 'camera-qr' },
  { id: 'qr-code-reader', name: 'QR Code Reader', description: 'Scan QR codes using your camera.', icon: ScanLine, path: '/tools/qr-code-reader', categoryId: 'camera-qr' },
];
