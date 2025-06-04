
"use client";
import { AppHeader } from "@/components/layout/app-header";
import ToolCard from "@/components/tools/tool-card";
import { TOOLS_CONFIG_WITH_DETAILS } from "@/lib/tools";
import { useFavorites } from "@/hooks/use-favorites";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from 'react';

export default function Home() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const favoriteTools = TOOLS_CONFIG_WITH_DETAILS.filter(tool => favorites.includes(tool.id));
  const otherTools = TOOLS_CONFIG_WITH_DETAILS.filter(tool => !favorites.includes(tool.id));

  if (!isClient) {
    // Render a loading state or null until the client has mounted
    // This helps avoid hydration mismatches with localStorage
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-8">
          <div className="text-center py-10">Loading tools...</div>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OmniTool. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        {favoriteTools.length > 0 && (
          <>
            <h2 className="text-2xl font-bold font-headline text-primary mb-6">Favorite Tools</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  isFavorite={isFavorite(tool.id)}
                  onToggleFavorite={toggleFavorite}
                  path={tool.path}
                />
              ))}
            </div>
            <Separator className="my-10" />
          </>
        )}

        <h2 className="text-2xl font-bold font-headline text-primary mb-6">
          {favoriteTools.length > 0 ? "All Tools" : "Tools"}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {otherTools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              description={tool.description}
              icon={tool.icon}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={toggleFavorite}
              path={tool.path}
            />
          ))}
           {TOOLS_CONFIG_WITH_DETAILS.length === 0 && <p>No tools available.</p>}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} OmniTool. All rights reserved.
      </footer>
    </div>
  );
}
