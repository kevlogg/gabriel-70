"use client";

import TreasureChest from "./TreasureChest";
import type { GiftConfig } from "@/config/event";

interface GiftCardProps {
  gift: GiftConfig;
  onChestOpen?: () => void;
}

export default function GiftCard({ gift, onChestOpen }: GiftCardProps) {
  return <TreasureChest gift={gift} onChestOpen={onChestOpen} />;
}
