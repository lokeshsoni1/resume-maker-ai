
import { useState, useEffect } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import {
  CheckCircle,
  Star,
  Award,
  Sparkles,
  Download,
  Palette,
  Trophy,
  Wand
} from 'lucide-react';
import { Badge } from '@/types';

export const BadgeDisplay = () => {
  const { badges } = useResume();
  const [showBadge, setShowBadge] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  
  // Check for newly unlocked badges
  useEffect(() => {
    const unlockedBadges = badges.filter(badge => badge.unlocked);
    const savedUnlocked = localStorage.getItem('displayed-badges');
    const displayedBadges = savedUnlocked ? JSON.parse(savedUnlocked) : [];
    
    // Find newly unlocked badges that haven't been displayed yet
    const newUnlocked = unlockedBadges.filter(badge => !displayedBadges.includes(badge.id));
    
    if (newUnlocked.length > 0) {
      setActiveBadge(newUnlocked[0]);
      setShowBadge(true);
      
      // Save to displayed badges
      localStorage.setItem('displayed-badges', JSON.stringify([
        ...displayedBadges,
        newUnlocked[0].id
      ]));
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBadge(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [badges]);
  
  // Define all possible badges with their icons
  const allBadges: Record<string, { name: string, description: string, icon: React.ReactNode }> = {
    'first-resume': {
      name: 'First Resume',
      description: 'Created your first resume',
      icon: <CheckCircle className="w-10 h-10 text-green-500" />
    },
    'theme-explorer': {
      name: 'Theme Explorer',
      description: 'Tried 3 different themes',
      icon: <Palette className="w-10 h-10 text-purple-500" />
    },
    'download-master': {
      name: 'Download Master',
      description: 'Downloaded 5 resumes',
      icon: <Download className="w-10 h-10 text-blue-500" />
    },
    'skills-guru': {
      name: 'Skills Guru',
      description: 'Added more than 10 skills',
      icon: <Star className="w-10 h-10 text-amber-500" />
    },
    'complete-profile': {
      name: 'Complete Profile',
      description: 'Filled out all sections of the form',
      icon: <Award className="w-10 h-10 text-indigo-500" />
    },
    'ai-enthusiast': {
      name: 'AI Enthusiast',
      description: 'Used AI suggestions 3 times',
      icon: <Sparkles className="w-10 h-10 text-fuchsia-500" />
    },
    'ai-power-user': {
      name: 'AI Power User',
      description: 'Used AI suggestions 10+ times',
      icon: <Trophy className="w-10 h-10 text-amber-500" />
    },
    'ai-template-creator': {
      name: 'Template Creator',
      description: 'Generated 3+ unique AI templates',
      icon: <Wand className="w-10 h-10 text-teal-500" />
    }
  };
  
  // Render nothing if no badge to show
  if (!showBadge || !activeBadge) return null;
  
  const badgeInfo = allBadges[activeBadge.id] || {
    name: activeBadge.name,
    description: activeBadge.description,
    icon: <Award className="w-10 h-10 text-purple-500" />
  };
  
  return (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg shadow-xl flex items-center space-x-4">
        <div className="bg-white/20 p-3 rounded-full">
          {badgeInfo.icon}
        </div>
        <div>
          <h3 className="font-bold text-lg">Badge Unlocked!</h3>
          <p className="font-semibold">{badgeInfo.name}</p>
          <p className="text-sm opacity-90">{badgeInfo.description}</p>
        </div>
      </div>
    </div>
  );
};
