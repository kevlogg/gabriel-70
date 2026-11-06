"use client";

import TreasureChest from "./TreasureChest";
import type { GiftConfig } from "@/config/event";
import type { TemplateId } from "@/lib/schemas/invitation.schema";

interface GiftCardProps {
  gift: GiftConfig;
  onChestOpen?: () => void;
  theme?: TemplateId;
}

export default function GiftCard({ gift, onChestOpen, theme = "classic-gold" }: GiftCardProps) {
  return <TreasureChest gift={gift} onChestOpen={onChestOpen} theme={theme} />;
}

