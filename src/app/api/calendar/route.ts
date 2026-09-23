import { NextResponse } from "next/server";
import { EVENT_DATA } from "@/config/event";

function formatIcsDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export async function GET(): Promise<NextResponse> {
  const startDate = new Date(EVENT_DATA.targetDate);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // +4 hours

  const dtStart = formatIcsDate(startDate.toISOString());
  const dtEnd = formatIcsDate(endDate.toISOString());
  const now = formatIcsDate(new Date().toISOString());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gabriel 70//Invitacion Digital//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:gabriel-70-cumple-${now}@gabriel70.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(EVENT_DATA.headline)}`,
    `DESCRIPTION:${escapeIcsText(EVENT_DATA.subheadline)}`,
    `LOCATION:${escapeIcsText(`${EVENT_DATA.venue.name}, ${EVENT_DATA.venue.address}`)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Mañana es el cumple de ${EVENT_DATA.personName}! 🎉`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gabriel-70.ics"',
      "Cache-Control": "no-cache",
    },
  });
}
