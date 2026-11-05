import { NextRequest, NextResponse } from "next/server";
import { EVENT_DATA } from "@/config/event";
import { getInvitationBySlug, getDefaultInvitation } from "@/lib/dal/invitations";

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  let invitation = null;
  if (slug) {
    invitation = await getInvitationBySlug(slug);
  }
  if (!invitation) {
    invitation = await getDefaultInvitation();
  }

  const targetDate = invitation?.targetDate || EVENT_DATA.targetDate;
  const headline = invitation?.headline || EVENT_DATA.headline;
  const subheadline = invitation?.subheadline || EVENT_DATA.subheadline;
  const venueName = invitation?.venueName || EVENT_DATA.venue.name;
  const venueAddress = invitation?.venueAddress || EVENT_DATA.venue.address;
  const personName = invitation?.personName || EVENT_DATA.personName;
  const fileSlug = invitation?.slug || "evento";

  const startDate = new Date(targetDate);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // +4 hours

  const dtStart = formatIcsDate(startDate.toISOString());
  const dtEnd = formatIcsDate(endDate.toISOString());
  const now = formatIcsDate(new Date().toISOString());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitacion Digital//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${fileSlug}-${now}@invitaciondigital.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(headline)}`,
    `DESCRIPTION:${escapeIcsText(subheadline)}`,
    `LOCATION:${escapeIcsText(`${venueName}, ${venueAddress}`)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Mañana es el evento de ${personName}! 🎉`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileSlug}.ics"`,
      "Cache-Control": "no-cache",
    },
  });
}
