
"use client";
import { AppHeader } from "@/components/layout/app-header";
import ToolCard from "@/components/tools/tool-card";
import { TOOLS_CONFIG_WITH_DETAILS, CATEGORIES, type ToolCategory, type ToolDetails } from "@/lib/tools";
import { useFavorites } from "@/hooks/use-favorites";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from 'react';

const ALL_TOOLS_CATEGORY_ID = "all-tools";

export default function Home() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [isClient, setIsClient] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_TOOLS_CATEGORY_ID);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const favoriteTools = useMemo(() => 
    TOOLS_CONFIG_WITH_DETAILS.filter(tool => favorites.includes(tool.id)),
    [favorites]
  );

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, ToolDetails[]> = {};
    TOOLS_CONFIG_WITH_DETAILS.forEach(tool => {
      if (!favorites.includes(tool.id)) { // Exclude favorites from regular category listings
        if (!grouped[tool.categoryId]) {
          grouped[tool.categoryId] = [];
        }
        grouped[tool.categoryId].push(tool);
      }
    });
    return grouped;
  }, [favorites]);

  const displayedTools = useMemo(() => {
    if (activeCategoryId === ALL_TOOLS_CATEGORY_ID) {
      // Return all non-favorite tools, keeping them grouped by their original category for display
      return Object.entries(toolsByCategory).reduce((acc, [catId, tools]) => {
        if (tools.length > 0) {
          acc[catId] = tools;
        }
        return acc;
      }, {} as Record<string, ToolDetails[]>);
    }
    return toolsByCategory[activeCategoryId] ? { [activeCategoryId]: toolsByCategory[activeCategoryId] } : {};
  }, [activeCategoryId, toolsByCategory]);

  const getCategoryName = (categoryId: string): string => {
    if (categoryId === ALL_TOOLS_CATEGORY_ID) return "All Tools";
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  if (!isClient) {
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
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {favoriteTools.length > 0 && (
          <>
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">Favorite Tools</h2>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
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
            <Separator className="my-8" />
          </>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold font-headline text-primary mb-4">Categories</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <Button
              variant={activeCategoryId === ALL_TOOLS_CATEGORY_ID ? "default" : "outline"}
              onClick={() => setActiveCategoryId(ALL_TOOLS_CATEGORY_ID)}
              className="shrink-0"
            >
              All Tools
            </Button>
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={activeCategoryId === category.id ? "default" : "outline"}
                onClick={() => setActiveCategoryId(category.id)}
                className="shrink-0"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {Object.entries(displayedTools).map(([categoryId, toolsInSection]) => {
           // Only render if there are tools in this section (after favorites are excluded)
           if (toolsInSection.length === 0) return null;

           return (
            <div key={categoryId} className="mb-8">
              <h3 className="text-xl font-semibold font-headline text-primary/90 mb-4">
                {getCategoryName(categoryId)}
              </h3>
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {toolsInSection.map((tool) => (
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
              {toolsInSection.length === 0 && activeCategoryId !== ALL_TOOLS_CATEGORY_ID && <p>No tools in this category.</p>}
            </div>
           );
        })}
        
        {TOOLS_CONFIG_WITH_DETAILS.length === 0 && <p className="mt-6 text-center">No tools available.</p>}
        {Object.keys(displayedTools).length === 0 && TOOLS_CONFIG_WITH_DETAILS.length > 0 && activeCategoryId !== ALL_TOOLS_CATEGORY_ID && (
          <p className="mt-6 text-center">No tools found in the category "{getCategoryName(activeCategoryId)}".</p>
        )}


      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} OmniTool. All rights reserved.
      </footer>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>
    </div>
  );
}
