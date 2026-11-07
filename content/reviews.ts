/**
 * Google reviews shown on both live sites via Trustindex (CONTENT_FACTS §7 🟡), copied verbatim from the
 * crawl (.firecrawl/html/blog.html). Only the name casing is normalised. Not shown: Anne Batista's review —
 * it is signed with a student's full name (minor; CLAUDE.md). Source link to the Google listing pending the
 * Place ID (OPEN_QUESTIONS Q25); no aggregate rating until it comes from the live API.
 */
export type Review = { name: string; date: string; stars: 1 | 2 | 3 | 4 | 5; lang: "es" | "en"; text: string };

export const reviews: Review[] = [
  { name: "Paula Mariana Danilewicz", date: "2025-11-27", stars: 5, lang: "es", text: "Excelente propuesta, innovadora y creativa. El personal que acompaña de primerísima calidad y disponibilidad. Gracias Coded" },
  { name: "Jhenny Monroy", date: "2025-11-24", stars: 4, lang: "en", text: "My son really enjoyed the program. It was educational  and fun" },
  { name: "Hector Figarella", date: "2025-11-18", stars: 5, lang: "en", text: "Signifícative Learning of creative design, AI coding, teamwork, leadership that will be remembered for the rest of their lives and having fun at the same time" },
  { name: "Cristina Arreaga Cáceres", date: "2025-11-17", stars: 5, lang: "es", text: "Un programa increíble que combina perfectamente la diversión de los chicos con el aprendizaje y elaboración de proyectos. Estaremos participando nuevamente." },
  { name: "José Antonio Medina López", date: "2025-11-14", stars: 5, lang: "en", text: "This is an incredible experience that helps students gain hands-on experience in the technological and linguistic fields. It helps them become more responsible and independent in decision-making, and the learning environments are spectacular." },
  { name: "Nusly Lara", date: "2025-11-13", stars: 5, lang: "en", text: "CODED was an outstanding experience that contributed significantly to the growth of every student. The workshops provided valuable opportunities for students to learn, practice, and apply the knowledge they acquired throughout the school year. The staff offered exceptional support each day, taking care of the student, teachers and all participants with dedication. We are truly willing to recommend this program to our students, as it enriches their learning and personal development." },
  { name: "Yvonne Rodrìguez", date: "2025-11-13", stars: 5, lang: "en", text: "The STEAM program exceeds our expectations year by year! Amazing opportunity for students to learn while creating and doing. Highly recommend this program!\nIf you can dream it, you can CODE it!" },
  { name: "Raul Ernesto Martinez Osorio", date: "2025-11-11", stars: 5, lang: "es", text: "Este evento es uno de los mejores a nivel internacional, para educadores y estudiantes que desean ser una nueva generación de líderes." },
];
