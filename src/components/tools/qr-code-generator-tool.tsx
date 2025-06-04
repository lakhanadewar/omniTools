
"use client";

import { useState, useEffect, useCallback, type FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

const QRCodeGeneratorTool: FC = () => {
  const [data, setData] = useState<string>("OmniTool QR Code");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

  const generateQRCode = useCallback(async () => {
    if (!data.trim()) {
      toast({ title: "Error", description: "Please enter data for the QR code.", variant: "destructive" });
      setQrCodeUrl("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 300 });
      setQrCodeUrl(url);
      toast({ title: "QR Code Generated", description: "Successfully created QR code." });
    } catch (err) {
      console.error("QR Code generation error:", err);
      toast({ title: "Generation Error", description: "Could not generate QR code.", variant: "destructive" });
      setQrCodeUrl("");
    }
  }, [data, toast]);
  
  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">QR Code Generator</CardTitle>
        <QrCode className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="qrCodeData">Data</Label>
          <Input id="qrCodeData" value={data} onChange={(e) => setData(e.target.value)} placeholder="Enter data for QR code" />
        </div>
        <Button onClick={generateQRCode} className="w-full">Generate QR Code</Button>
        {qrCodeUrl && (
          <div className="mt-4 p-4 border border-dashed border-border rounded-md flex justify-center items-center bg-muted">
            <Image 
              src={qrCodeUrl} 
              alt="Generated QR Code" 
              width={200} // Adjusted size for better display
              height={200}
              className="object-contain"
              data-ai-hint="qr code"
            />
          </div>
        )}
         {!qrCodeUrl && data.trim() && (
           <p className="text-xs text-muted-foreground text-center">Enter data and click "Generate QR Code".</p>
         )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGeneratorTool;
