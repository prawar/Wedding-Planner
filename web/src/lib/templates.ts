export type TemplateStyle = "Floral" | "Royal" | "Minimal" | "Traditional";

export type InviteTemplate = {
  id: string;
  name: string;
  style: TemplateStyle;
  tradition: string;
  hasVideo: boolean;
  /** Placeholder cover colour until real artwork exists. */
  tint: string;
};

// Placeholder catalogue. Real templates replace these once artwork is ready.
export const templates: InviteTemplate[] = [
  { id: "template-1", name: "Template 1", style: "Floral", tradition: "Hindu", hasVideo: true, tint: "#f7c9d8" },
  { id: "template-2", name: "Template 2", style: "Royal", tradition: "Hindu", hasVideo: true, tint: "#f2d58a" },
  { id: "template-3", name: "Template 3", style: "Minimal", tradition: "Any tradition", hasVideo: false, tint: "#cfe3dd" },
  { id: "template-4", name: "Template 4", style: "Traditional", tradition: "Sikh", hasVideo: false, tint: "#d9ccf0" },
  { id: "template-5", name: "Template 5", style: "Floral", tradition: "Any tradition", hasVideo: false, tint: "#f4b9a6" },
  { id: "template-6", name: "Template 6", style: "Royal", tradition: "Hindu", hasVideo: true, tint: "#bfd9f2" },
];

export const templateStyles: TemplateStyle[] = ["Floral", "Royal", "Minimal", "Traditional"];
