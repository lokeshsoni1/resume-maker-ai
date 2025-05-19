
import { Icons } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-10" aria-label="Website footer">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Resume Builder</h3>
          <p className="text-muted-foreground text-sm">
            Create professional resumes quickly with advanced AI features.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Resume Writing Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Job Interview Tips
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Career Development
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 flex flex-col md:flex-row justify-between items-center border-t pt-6">
        <p className="text-center text-sm text-muted-foreground mb-4 md:mb-0">
          © 2025 made by Doctor Career. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">Twitter</span>
            <Icons.twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">Instagram</span>
            <Icons.instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <span className="sr-only">Facebook</span>
            <Icons.facebook className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
