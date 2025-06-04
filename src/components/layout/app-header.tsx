
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" passHref>
          <h1 className="text-2xl font-bold font-headline text-primary cursor-pointer">OmniTool</h1>
        </Link>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tools..."
            className="pl-10"
          />
        </div>
      </div>
    </header>
  );
}
