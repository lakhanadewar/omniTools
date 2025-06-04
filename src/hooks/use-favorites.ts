
"use client";
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'omnitool_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // This effect runs only on the client after hydration
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error reading favorites from localStorage", error);
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(toolId)
        ? prevFavorites.filter(id => id !== toolId)
        : [...prevFavorites, toolId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage", error);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
