import { InfoIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface HoverInfoCardProps {
  title: string;
  description: string;
}

export const HoverInfoCard = ({ title, description }: HoverInfoCardProps) => {
  return (
    <HoverCard openDelay={40} closeDelay={100}>
      <HoverCardTrigger asChild>
        <InfoIcon className="size-3 stroke-muted-foreground" />
      </HoverCardTrigger>
      <HoverCardContent side="top" className="text-sm">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
