export interface VenueConfig {
  name: string;
  address: string;
  mapsUrl: string;
  googleCalendarUrl: string;
}

export interface GiftConfig {
  bankName: string;
  alias: string;
  cbu: string;
  holderName: string;
}

export interface EventConfig {
  personName: string;
  headline: string;
  subheadline: string;
  targetDate: string; // ISO 8601
  venue: VenueConfig;
  gift: GiftConfig;
  audioTrackPath: string;
}

export const EVENT_DATA: EventConfig = {
  personName: "Gabriel",
  headline: "Los 70 de Gabriel",
  subheadline: "¡Acompañanos a celebrar una vida llena de momentos inolvidables!",
  targetDate: "2026-11-14T20:30:00-03:00",
  venue: {
    name: 'Finca "El Reencuentro"',
    address: "Mar del Plata, Provincia de Buenos Aires",
    mapsUrl:
      "https://www.google.com/maps/place/Estancia+El+Reencuentro/@-38.03669,-57.66229,17z/data=!3m1!4b1!4m6!3m5!1s0x958521004a40392b:0x5e96a5d071589674!8m2!3d-38.03669!4d-57.66229!16s%2Fg%2F11yjhxp356",
    googleCalendarUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Los+70+de+Gabriel&dates=20261114T233000Z/20261115T043000Z&details=Festejo+de+los+70+a%C3%B1os+de+Gabriel+en+Finca+El+Reencuentro.&location=Finca+El+Reencuentro%2C+Mar+del+Plata",
  },
  gift: {
    bankName: "Banco / Billetera Virtual",
    alias: "GABRIEL.70.CUMPLE",
    cbu: "0000003100010000000000",
    holderName: "Gabriel",
  },
  audioTrackPath: "/audio/celebration.mp3",
};
