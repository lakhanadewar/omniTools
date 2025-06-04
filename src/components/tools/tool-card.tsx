
"use client";
import Link from 'next/link';
import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  path: string;
}

const ToolCard: FC<ToolCardProps> = ({ id, name, description, icon: Icon, isFavorite, onToggleFavorite, path }) => {
  return (
    <Link href={path} passHref legacyBehavior>
      <a className="block h-full no-underline">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col h-full hover:scale-105 cursor-pointer">
          <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
            <div className="space-y-1 flex-grow">
              <CardTitle className="text-xl font-semibold font-headline flex items-center">
                <Icon className="h-6 w-6 mr-3 text-primary flex-shrink-0" />
                <span className="truncate">{name}</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-tight pt-1 h-16 overflow-hidden">
                {description}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation
                e.stopPropagation(); // Stop event from bubbling to Link
                onToggleFavorite(id);
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="ml-2 shrink-0 z-10" // z-10 to ensure it's clickable over the link
            >
              <Star className={cn("h-5 w-5", isFavorite ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent")} />
            </Button>
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            {/* Content can be minimal or removed if the card itself is the call to action */}
            <p className="text-xs text-primary/80 text-right">View Tool &rarr;</p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default ToolCard;
