
import { useResume } from '@/contexts/ResumeContext';
import { Badge } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const BadgeDisplay = () => {
  const { badges } = useResume();
  
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  if (unlockedBadges.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow animate-pulse"
            aria-label="View achievements"
          >
            <div className="relative">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unlockedBadges.length}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <h4 className="font-semibold text-lg mb-1">Your Achievements</h4>
            <p className="text-sm text-muted-foreground">
              {unlockedBadges.length} of {badges.length} badges unlocked
            </p>
          </div>
          <div className="p-4 max-h-[300px] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2 text-sm">Unlocked Badges</h5>
                <div className="space-y-3">
                  {unlockedBadges.map(badge => (
                    <BadgeItem key={badge.id} badge={badge} unlocked={true} />
                  ))}
                </div>
              </div>
              
              {lockedBadges.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 text-sm">Locked Badges</h5>
                  <div className="space-y-3">
                    {lockedBadges.map(badge => (
                      <BadgeItem key={badge.id} badge={badge} unlocked={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface BadgeItemProps {
  badge: Badge;
  unlocked: boolean;
}

const BadgeItem = ({ badge, unlocked }: BadgeItemProps) => (
  <div className={`flex items-center gap-3 p-2 rounded-lg ${unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
      unlocked 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-muted-foreground/20 text-muted-foreground/50'
    }`}>
      {badge.icon}
    </div>
    <div>
      <h6 className="font-medium">{badge.name}</h6>
      <p className="text-xs text-muted-foreground">{badge.description}</p>
    </div>
  </div>
);
