"use client";

import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import ClassicGoldTemplate from "./templates/ClassicGoldTemplate";
import ToyStoryTemplate from "./templates/ToyStoryTemplate";
import KpopTemplate from "./templates/KpopTemplate";
import PrincesasTemplate from "./templates/PrincesasTemplate";
import FutbolInfantilTemplate from "./templates/FutbolInfantilTemplate";

interface InvitationViewProps {
  invitation: InvitationRecord;
}

export default function InvitationView({ invitation }: InvitationViewProps) {
  switch (invitation.template) {
    case "toy-story":
      return <ToyStoryTemplate invitation={invitation} />;
    case "k-pop":
      return <KpopTemplate invitation={invitation} />;
    case "princesas":
      return <PrincesasTemplate invitation={invitation} />;
    case "futbol-infantil":
      return <FutbolInfantilTemplate invitation={invitation} />;
    case "classic-gold":
    default:
      return <ClassicGoldTemplate invitation={invitation} />;
  }
}
