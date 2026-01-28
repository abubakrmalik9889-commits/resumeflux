
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import FileSaver from "file-saver";
import JSZip from "jszip";
import { ResumeData } from "../types.ts";

// Handle potential differences in how file-saver is exported via ESM CDNs
const saveAs = (FileSaver as any).saveAs || (FileSaver as any).default || FileSaver;

/**
 * Generates the Blob for a single resume DOCX.
 */
export const generateDocxBlob = async (data: ResumeData): Promise<Blob> => {
  const { personalInfo, workExperience, education, skills, summary, margin = 0.4 } = data;
  
  // 1 inch = 1440 twips
  const marginTwips = Math.round(margin * 1440);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: marginTwips,
              right: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (personalInfo.fullName || "NAME").toUpperCase(),
                bold: true,
                size: 48, // 24pt
                color: "1F2A44",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (personalInfo.jobTitle || "PROFESSIONAL ROLE").toUpperCase(),
                bold: true,
                size: 24, // 12pt
                color: "1ABC9C",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: [
                  personalInfo.email,
                  personalInfo.phone,
                  personalInfo.location,
                  personalInfo.linkedin
                ].filter(Boolean).join(" | "),
                size: 18,
                color: "666666",
              }),
            ],
          }),

          // Summary Section
          ...(summary
            ? [
                new Paragraph({
                  text: "PROFESSIONAL SUMMARY",
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200 },
                  alignment: AlignmentType.LEFT,
                }),
                new Paragraph({
                  text: summary,
                  spacing: { before: 200, after: 400 },
                }),
              ]
            : []),

          // Experience Section
          ...(workExperience.length > 0 ? [
            new Paragraph({
              text: "WORK EXPERIENCE",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200 },
            }),
            ...workExperience.flatMap((exp) => [
              new Paragraph({
                spacing: { before: 200 },
                children: [
                  new TextRun({ text: (exp.role || "ROLE").toUpperCase(), bold: true, color: "1F2A44" }),
                  new TextRun({ text: `\t${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`, bold: true }),
                ],
                alignment: AlignmentType.LEFT,
                tabStops: [{ type: "right", position: 9000 }],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: exp.company || "Company", italics: true, color: "666666" }),
                  new TextRun({ text: `\t${exp.location || ""}` }),
                ],
                tabStops: [{ type: "right", position: 9000 }],
              }),
              new Paragraph({
                text: exp.description || "",
                spacing: { before: 100, after: 300 },
              }),
            ])
          ] : []),

          // Education Section
          ...(education.length > 0 ? [
            new Paragraph({
              text: "EDUCATION",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200 },
            }),
            ...education.flatMap((edu) => [
              new Paragraph({
                spacing: { before: 200 },
                children: [
                  new TextRun({ text: `${edu.degree || ""} ${edu.field || ""}`, bold: true }),
                  new TextRun({ text: `\t${edu.graduationDate || ""}` }),
                ],
                tabStops: [{ type: "right", position: 9000 }],
              }),
              new Paragraph({
                text: `${edu.school || ""}, ${edu.location || ""}`,
                spacing: { after: 300 },
              }),
            ])
          ] : []),

          // Skills Section
          ...(skills.length > 0 ? [
            new Paragraph({
              text: "TECHNICAL SKILLS",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200 },
            }),
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({
                  text: skills.map((s) => s.name).join(" | "),
                  bold: true,
                  color: "1F2A44",
                }),
              ],
            }),
          ] : []),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const downloadAsDocx = async (data: ResumeData) => {
  try {
    const blob = await generateDocxBlob(data);
    const fileName = `${(data.personalInfo.fullName || data.title || "Resume").replace(/\s+/g, "_")}_Resume.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error("DOCX Export failed:", error);
    alert("Could not generate Word document. Please ensure you are using a modern browser.");
  }
};

/**
 * Bundles all resumes into a single ZIP archive.
 */
export const downloadAllAsZip = async (resumes: ResumeData[], userName: string) => {
  if (!resumes || resumes.length === 0) {
    alert("No resumes found to download.");
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder("My_Resumes");

  try {
    for (let i = 0; i < resumes.length; i++) {
      const resume = resumes[i];
      const blob = await generateDocxBlob(resume);
      const safeTitle = (resume.title || `Resume_${i + 1}`).replace(/\s+/g, "_");
      folder?.file(`${safeTitle}.docx`, blob);
      folder?.file(`${safeTitle}_backup.json`, JSON.stringify(resume, null, 2));
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `Resumeflux_Workspace_${userName.replace(/\s+/g, "_")}.zip`);
  } catch (error) {
    console.error("ZIP Generation failed:", error);
    alert("Failed to create ZIP archive. Please try individual DOCX downloads.");
  }
};
