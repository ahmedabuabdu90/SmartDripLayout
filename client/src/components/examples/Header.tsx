import { Header } from "../Header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function HeaderExample() {
  return (
    <TooltipProvider>
      <Header />
    </TooltipProvider>
  );
}
