
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '@/types';
import { 
  Sun, 
  Moon, 
  Zap, 
  Palette, 
  GlassWater, 
  Sparkles, 
  Rewind, 
  CircleDot,
  Leaf, 
  ShuffleIcon
} from 'lucide-react';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void;
  themes: Theme[];
  randomizeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'light',
  setTheme: () => {},
  themes: [],
  randomizeTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themes: Theme[] = [
    {
      id: 'light',
      name: 'Light Mode',
      className: '',
      icon: <Sun className="h-4 w-4" />,
      description: 'Clean white background, crisp black text, minimal shadows'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      className: 'theme-dark',
      icon: <Moon className="h-4 w-4" />,
      description: 'Deep charcoal background, white text, subtle highlights'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      className: 'theme-cyberpunk bg-cyberpunk',
      icon: <Zap className="h-4 w-4" />,
      description: 'Neon blues and pinks, futuristic fonts, glowing borders'
    },
    {
      id: 'neon',
      name: 'Neon Glow',
      className: 'theme-neon bg-neon',
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Vibrant neon accents, dark background, pulsating effects'
    },
    {
      id: 'pastel',
      name: 'Pastel Gradient',
      className: 'theme-pastel bg-pastel',
      icon: <Palette className="h-4 w-4" />,
      description: 'Soft pastel colors, smooth gradients, calming vibe'
    },
    {
      id: 'glass',
      name: 'Glassmorphism',
      className: 'theme-glass bg-glass',
      icon: <GlassWater className="h-4 w-4" />,
      description: 'Frosted glass effects, translucent cards, soft blur'
    },
    {
      id: 'aurora',
      name: 'Aurora Night',
      className: 'theme-aurora bg-aurora',
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Northern lights-inspired gradients, starry animations'
    },
    {
      id: 'retro',
      name: 'Retro Wave',
      className: 'theme-retro bg-retro',
      icon: <Rewind className="h-4 w-4" />,
      description: '80s synthwave aesthetic, bold purples and blues'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      className: 'theme-monochrome bg-monochrome',
      icon: <CircleDot className="h-4 w-4" />,
      description: 'Single-color palette with varying shades, elegant and sleek'
    },
    {
      id: 'nature',
      name: 'Nature Bloom',
      className: 'theme-nature bg-nature',
      icon: <Leaf className="h-4 w-4" />,
      description: 'Earthy tones, floral accents, organic shapes'
    },
  ];

  // Get saved theme from localStorage or use default
  const getSavedTheme = () => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('resume-builder-theme') : null;
    return savedTheme || 'light';
  };

  const [currentTheme, setCurrentTheme] = useState(getSavedTheme());

  // Apply theme to body when it changes
  useEffect(() => {
    // Add no-transition class to prevent flickering
    document.body.classList.add('no-transition');
    
    // Remove all theme classes
    const themeClasses = themes
      .map(theme => theme.className ? theme.className.split(' ') : [])
      .flat()
      .filter(className => className !== ''); // Filter out empty strings
    
    themeClasses.forEach(className => {
      if (className) {
        document.body.classList.remove(className);
      }
    });
    
    // Add new theme class
    const theme = themes.find(t => t.id === currentTheme);
    if (theme && theme.className) {
      const classNames = theme.className.split(' ').filter(name => name !== '');
      if (classNames.length > 0) {
        document.body.classList.add(...classNames);
      }
    }
    
    // Save theme to localStorage
    localStorage.setItem('resume-builder-theme', currentTheme);
    
    // Remove no-transition class after a short delay
    setTimeout(() => {
      document.body.classList.remove('no-transition');
    }, 50);
  }, [currentTheme]);

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  // Randomize theme function
  const randomizeTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex].id);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes, randomizeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
