import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t py-8">
      <div className="section-container">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by A Sridhar Patra</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {currentYear} A Sridhar Patra. All rights reserved.
          </p>
          
          <p className="text-xs text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;