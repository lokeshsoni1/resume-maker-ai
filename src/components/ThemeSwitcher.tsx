
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShuffleIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ThemeSwitcher = () => {
  const { currentTheme, setTheme, themes, randomizeTheme } = useTheme();
  const { addExploredTheme } = useResume();
  const [open, setOpen] = useState(false);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    addExploredTheme(themeId);
    setOpen(false);
  };

  const handleRandomTheme = () => {
    randomizeTheme();
    addExploredTheme(themes[Math.floor(Math.random() * themes.length)].id);
    setOpen(false);
  };

  const currentThemeObj = themes.find(t => t.id === currentTheme);

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hover-scale">
                {currentThemeObj?.icon || themes[0].icon}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change Theme</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-56 z-50">
          <div className="flex flex-col gap-1 p-2">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                className={`flex items-center gap-2 cursor-pointer ${
                  currentTheme === theme.id ? 'bg-primary/10' : ''
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  {theme.icon}
                  <span>{theme.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer mt-2 border-t pt-2"
              onClick={handleRandomTheme}
            >
              <div className="flex items-center gap-2 flex-1">
                <ShuffleIcon className="h-4 w-4" />
                <span>Random Theme</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};
