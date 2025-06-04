
"use client";

import { useState, useEffect, useCallback, type FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Barcode } from "lucide-react"; // This file will be deleted but change required to prevent conflicts
import { useToast } from "@/hooks/use-toast";

const BarcodeGeneratorTool: FC = () => {
  const [data, setData] = useState<string>("OmniTool123");
  const [barcodeUrl, setBarcodeUrl] = useState<string>("");
  const { toast } = useToast();

  const generateBarcode = useCallback(() => {
    if (!data.trim()) {
      toast({ title: "Error", description: "Please enter data for the barcode.", variant: "destructive" });
      return;
    }
    // In a real app, you'd use a library like JsBarcode or an API call.
    // For this example, we'll use a placeholder service.
    // Note: placehold.co does not generate actual barcodes. This is a visual placeholder.
    const placeholderUrl = `https://placehold.co/300x100.png?text=Barcode:${encodeURIComponent(data)}`;
    setBarcodeUrl(placeholderUrl);
    toast({ title: "Barcode Generated (Placeholder)", description: "A placeholder image is shown." });
  }, [data, toast]);
  
  // Generate a default barcode on initial load
  useEffect(() => {
    generateBarcode();
  }, [generateBarcode]);


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">Barcode Generator</CardTitle>
        <Barcode className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="barcodeData">Data</Label>
          <Input id="barcodeData" value={data} onChange={(e) => setData(e.target.value)} placeholder="Enter data for barcode" />
        </div>
        <Button onClick={generateBarcode} className="w-full">Generate Barcode</Button>
        {barcodeUrl && (
          <div className="mt-4 p-4 border border-dashed border-border rounded-md flex justify-center items-center bg-muted">
            <Image 
              src={barcodeUrl} 
              alt="Generated Barcode Placeholder" 
              width={300} 
              height={100}
              className="object-contain"
              data-ai-hint="barcode illustration"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center">Note: This is a visual placeholder. For actual barcode generation, a dedicated library or service is required.</p>
      </CardContent>
    </Card>
  );
};

export default BarcodeGeneratorTool;
