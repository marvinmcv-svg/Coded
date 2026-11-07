/**
 * Teachers & team named on codededucation.com (CONTENT_FACTS §6). Marvin OK'd names + photos on 2026-11-07.
 * Roles are short labels in messages (`home.teachers.roles.<slug>`). Delivery partners are not named (still 🔴).
 * Dr Claire Keene has no photo on the source site → initials tile.
 */
import type { BuiltImage } from "./media";

export type Teacher = { slug: string; name: string; photo: BuiltImage | null };

export const teachers: Teacher[] = [
  { slug: "kay-hill", name: "Kay Hill", photo: "t-kay-hill" },
  { slug: "peter-smith", name: "Peter Smith", photo: "t-peter-smith" },
  { slug: "isobel-haynes", name: "Isobel Haynes", photo: "t-isobel-haynes" },
  { slug: "ryen-detoro", name: "Ryen DeToro", photo: "t-ryen-detoro" },
  { slug: "tom-caruth", name: "Tom Caruth", photo: "t-tom-caruth" },
  { slug: "calum-bell", name: "Calum Bell", photo: "t-calum-bell" },
  { slug: "richard-emmerton", name: "Richard Emmerton", photo: "t-richard-emmerton" },
  { slug: "scott-lu", name: "Scott Lu", photo: "t-scott-lu" },
  { slug: "rayan-took", name: "Rayan Took", photo: "t-rayan-took" },
  { slug: "claire-keene", name: "Dr Claire Keene", photo: null },
  { slug: "carolina-capelo-garcia", name: "Carolina Capelo Garcia", photo: "t-carolina-capelo-garcia" },
];
