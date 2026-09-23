"use client";

import TreasureChest from "./TreasureChest";
import type { GiftConfig } from "@/config/event";

interface GiftCardProps {
  gift: GiftConfig;
}

export default function GiftCard({ gift }: GiftCardProps) {
  return <TreasureChest gift={gift} />;
}
