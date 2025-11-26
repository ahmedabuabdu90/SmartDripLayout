import { Droplets, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground">
          <Droplets className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight" data-testid="text-app-title">
            Smart Drip Irrigation Designer
          </h1>
          <p className="text-xs text-muted-foreground">
            Parametric CAD Tool v1.0
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" data-testid="button-help">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View documentation</p>
          </TooltipContent>
        </Tooltip>
        <ThemeToggle />
      </div>
    </header>
  );
}
