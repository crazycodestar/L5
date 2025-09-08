import sharp from "sharp";
import { join } from "path";

// Interface for certificate data
export interface CertificateData {
  name: string;
  course: string;
  instructor: string;
  date: string;
  template?: "1.png" | "2.png" | "3.png" | "4.png";
}

// Approximate text measurement and wrapping (SVG-based rendering does not expose ctx.measureText)
function approximateTextWidth(text: string, fontSizePx: number): number {
  // Rough average width factor for Latin scripts; tweak if needed
  const averageCharWidthFactor = 0.6;
  return text.length * fontSizePx * averageCharWidthFactor;
}

function wrapTextApprox(
  text: string,
  maxWidth: number,
  fontSizePx: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words.length > 0 ? words[0] : "";

  for (let i = 1; i < words.length; i++) {
    const candidate =
      currentLine.length > 0 ? currentLine + " " + words[i] : words[i];
    const width = approximateTextWidth(candidate, fontSizePx);
    if (width <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine.length > 0) lines.push(currentLine);
      currentLine = words[i];
    }
  }

  if (currentLine.length > 0) lines.push(currentLine);
  return lines;
}

function svgTextBlock(params: {
  x: number;
  y: number;
  fontFamily: string;
  fontWeight?: string;
  fontSizePx: number;
  fill: string;
  textAnchor: "start" | "middle" | "end";
  lines: string[];
  lineHeightPx: number;
}): string {
  const {
    x,
    y,
    fontFamily,
    fontWeight,
    fontSizePx,
    fill,
    textAnchor,
    lines,
    lineHeightPx,
  } = params;

  const tspans = lines
    .map((line, idx) => {
      const dy = idx === 0 ? 0 : lineHeightPx;
      return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<text x="${x}" y="${y}" fill="${fill}" text-anchor="${textAnchor}" font-family="${escapeXml(
    fontFamily
  )}" ${
    fontWeight ? `font-weight="${fontWeight}"` : ""
  } font-size="${fontSizePx}">${tspans}</text>`;
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Function to generate certificate with text overlay
export async function generateCertificate(
  templatePath: string,
  data: CertificateData
): Promise<Buffer> {
  // Read template dimensions
  const image = sharp(templatePath);
  const metadata = await image.metadata();
  const width = metadata.width || 3508; // sensible default (A4 @ 300dpi width)
  const height = metadata.height || 2480; // sensible default (A4 @ 300dpi height)

  // Extract template name from path to determine styling
  const templateName = templatePath.split("/").pop() || "1.png";

  // Set text color based on template
  const textColor = templateName === "4.png" ? "#FFFFFF" : "#000000";

  const centerX = width / 2;

  // We will build an SVG overlay with all texts, then composite over the template
  const svgParts: string[] = [
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`,
  ];

  // Template-specific positioning and styling
  switch (templateName) {
    case "1.png":
      // Configure fonts with larger sizes
      const fontFamily1 = "Arial, sans-serif";
      const scriptFamily1 = "'Dancing Script', 'Brush Script MT', cursive";
      const largeSize1 = 500;
      const mediumSize1 = 280;
      const regularSize1 = 200;
      const smallSize1 = 160;

      // Template 1: Standard layout with larger text
      const nameY1 = height * 0.58;
      const courseY1 = height * 0.72;
      const instructorY1 = height * 0.84;
      const dateY1 = height * 0.84;
      const instructorX1 = width * 0.255;
      const dateX1 = width * 0.75;

      // Recipient name (script font, centered)
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: nameY1,
          fontFamily: scriptFamily1,
          fontWeight: undefined,
          fontSizePx: largeSize1,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.name],
          lineHeightPx: largeSize1,
        })
      );

      // Course name with wrapping
      const courseMaxWidth1 = width * 0.8;
      const courseLineHeight1 = 240;
      const courseLines1 = wrapTextApprox(
        data.course,
        courseMaxWidth1,
        mediumSize1
      );
      const courseFontSize1 =
        courseLines1.length > 1 ? regularSize1 : mediumSize1;
      const courseStartY1 = courseLines1.length > 1 ? height * 0.7 : courseY1;
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: courseStartY1,
          fontFamily: fontFamily1,
          fontWeight: "bold",
          fontSizePx: courseFontSize1,
          fill: textColor,
          textAnchor: "middle",
          lines: courseLines1,
          lineHeightPx: courseLineHeight1,
        })
      );

      // Instructor and Date
      svgParts.push(
        svgTextBlock({
          x: instructorX1,
          y: instructorY1,
          fontFamily: fontFamily1,
          fontWeight: "bold",
          fontSizePx: smallSize1,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.instructor],
          lineHeightPx: smallSize1,
        })
      );
      svgParts.push(
        svgTextBlock({
          x: dateX1,
          y: dateY1,
          fontFamily: fontFamily1,
          fontWeight: "bold",
          fontSizePx: smallSize1,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.date],
          lineHeightPx: smallSize1,
        })
      );
      break;

    case "2.png":
      // Configure fonts with larger sizes
      const fontFamily2 = "Arial, sans-serif";
      const scriptFamily2 = "'Dancing Script', 'Brush Script MT', cursive";
      const largeSize2 = 500;
      const mediumSize2 = 280;
      const regularSize2 = 200;
      const smallSize2 = 160;

      // Template 2: Different positioning
      const nameY2 = height * 0.545;
      const courseY2 = height * 0.69;
      const instructorY2 = height * 0.85;
      const dateY2 = height * 0.85;
      const instructorX2 = width * 0.375;
      const dateX2 = width * 0.632;

      // Recipient name
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: nameY2,
          fontFamily: scriptFamily2,
          fontWeight: undefined,
          fontSizePx: largeSize2,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.name],
          lineHeightPx: largeSize2,
        })
      );

      // Course name with wrapping
      const courseMaxWidth2 = width * 0.8;
      const courseLineHeight2 = 240;
      const courseLines2 = wrapTextApprox(
        data.course,
        courseMaxWidth2,
        mediumSize2
      );
      const courseFontSize2 =
        courseLines2.length > 1 ? regularSize2 : mediumSize2;
      const courseStartY2 = courseLines2.length > 1 ? height * 0.67 : courseY2;
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: courseStartY2,
          fontFamily: fontFamily2,
          fontWeight: "bold",
          fontSizePx: courseFontSize2,
          fill: textColor,
          textAnchor: "middle",
          lines: courseLines2,
          lineHeightPx: courseLineHeight2,
        })
      );

      // Instructor and Date
      svgParts.push(
        svgTextBlock({
          x: instructorX2,
          y: instructorY2,
          fontFamily: fontFamily2,
          fontWeight: "bold",
          fontSizePx: smallSize2,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.instructor],
          lineHeightPx: smallSize2,
        })
      );
      svgParts.push(
        svgTextBlock({
          x: dateX2,
          y: dateY2,
          fontFamily: fontFamily2,
          fontWeight: "bold",
          fontSizePx: smallSize2,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.date],
          lineHeightPx: smallSize2,
        })
      );
      break;

    case "3.png":
      // Configure fonts with larger sizes
      const fontFamily3 = "Arial, sans-serif";
      const scriptFamily3 = "'Dancing Script', 'Brush Script MT', cursive";
      const largeSize3 = 400;
      const mediumSize3 = 280;
      const regularSize3 = 200;
      const smallSize3 = 160;

      // Template 3: Different positioning
      const nameY3 = height * 0.52;
      const courseY3 = height * 0.67;
      const instructorY3 = height * 0.79;
      const dateY3 = height * 0.79;
      const instructorX3 = width * 0.25;
      const dateX3 = width * 0.765;

      // Recipient name
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: nameY3,
          fontFamily: scriptFamily3,
          fontWeight: undefined,
          fontSizePx: largeSize3,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.name],
          lineHeightPx: largeSize3,
        })
      );

      // Course name with wrapping
      const courseMaxWidth3 = width * 0.8;
      const courseLineHeight3 = 240;
      const courseLines3 = wrapTextApprox(
        data.course,
        courseMaxWidth3,
        mediumSize3
      );
      const courseFontSize3 =
        courseLines3.length > 1 ? regularSize3 : mediumSize3;
      const courseStartY3 = courseLines3.length > 1 ? height * 0.65 : courseY3;
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: courseStartY3,
          fontFamily: fontFamily3,
          fontWeight: "bold",
          fontSizePx: courseFontSize3,
          fill: textColor,
          textAnchor: "middle",
          lines: courseLines3,
          lineHeightPx: courseLineHeight3,
        })
      );

      // Instructor and Date
      svgParts.push(
        svgTextBlock({
          x: instructorX3,
          y: instructorY3,
          fontFamily: fontFamily3,
          fontWeight: "bold",
          fontSizePx: smallSize3,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.instructor],
          lineHeightPx: smallSize3,
        })
      );
      svgParts.push(
        svgTextBlock({
          x: dateX3,
          y: dateY3,
          fontFamily: fontFamily3,
          fontWeight: "bold",
          fontSizePx: smallSize3,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.date],
          lineHeightPx: smallSize3,
        })
      );
      break;

    case "4.png":
      // Configure fonts with larger sizes
      const fontFamily4 = "Arial, sans-serif";
      const scriptFamily4 = "'Dancing Script', 'Brush Script MT', cursive";
      const largeSize4 = 400;
      const mediumSize4 = 280;
      const regularSize4 = 200;
      const smallSize4 = 160;

      // Template 4: White text, different positioning
      const nameY4 = height * 0.49;
      const courseY4 = height * 0.65;
      const instructorY4 = height * 0.785;
      const dateY4 = height * 0.785;
      const instructorX4 = width * 0.316;
      const dateX4 = width * 0.685;

      // Recipient name
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: nameY4,
          fontFamily: scriptFamily4,
          fontWeight: undefined,
          fontSizePx: largeSize4,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.name],
          lineHeightPx: largeSize4,
        })
      );

      // Course name with wrapping
      const courseMaxWidth4 = width * 0.8;
      const courseLineHeight4 = 240;
      const courseLines4 = wrapTextApprox(
        data.course,
        courseMaxWidth4,
        mediumSize4
      );
      const courseFontSize4 =
        courseLines4.length > 1 ? regularSize4 : mediumSize4;
      const courseStartY4 = courseLines4.length > 1 ? height * 0.63 : courseY4;
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: courseStartY4,
          fontFamily: fontFamily4,
          fontWeight: "bold",
          fontSizePx: courseFontSize4,
          fill: textColor,
          textAnchor: "middle",
          lines: courseLines4,
          lineHeightPx: courseLineHeight4,
        })
      );

      // Instructor and Date
      svgParts.push(
        svgTextBlock({
          x: instructorX4,
          y: instructorY4,
          fontFamily: fontFamily4,
          fontWeight: "bold",
          fontSizePx: smallSize4,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.instructor],
          lineHeightPx: smallSize4,
        })
      );
      svgParts.push(
        svgTextBlock({
          x: dateX4,
          y: dateY4,
          fontFamily: fontFamily4,
          fontWeight: "bold",
          fontSizePx: smallSize4,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.date],
          lineHeightPx: smallSize4,
        })
      );
      break;

    default:
      // Configure fonts with larger sizes
      const fontFamily5 = "Arial, sans-serif";
      const largeSize5 = 300;
      const mediumSize5 = 280;
      const regularSize5 = 120;
      const smallSize5 = 160;

      // Fallback for unknown templates
      const nameY = height * 0.45;
      const courseY = height * 0.55;
      const instructorY = height * 0.75;
      const dateY = height * 0.75;
      const instructorX = width * 0.3;
      const dateX = width * 0.7;

      // Name
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: nameY,
          fontFamily: fontFamily5,
          fontWeight: "bold",
          fontSizePx: largeSize5,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.name],
          lineHeightPx: largeSize5,
        })
      );

      // Course
      const courseMaxWidth5 = width * 0.8;
      const courseLineHeight5 = 240;
      const courseLines5 = wrapTextApprox(
        data.course,
        courseMaxWidth5,
        mediumSize5
      );
      const courseFontSize5 =
        courseLines5.length > 1 ? regularSize5 : mediumSize5;
      svgParts.push(
        svgTextBlock({
          x: centerX,
          y: courseY,
          fontFamily: fontFamily5,
          fontWeight: "bold",
          fontSizePx: courseFontSize5,
          fill: textColor,
          textAnchor: "middle",
          lines: courseLines5,
          lineHeightPx: courseLineHeight5,
        })
      );

      // Instructor and Date
      svgParts.push(
        svgTextBlock({
          x: instructorX,
          y: instructorY,
          fontFamily: fontFamily5,
          fontWeight: "bold",
          fontSizePx: smallSize5,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.instructor],
          lineHeightPx: smallSize5,
        })
      );
      svgParts.push(
        svgTextBlock({
          x: dateX,
          y: dateY,
          fontFamily: fontFamily5,
          fontWeight: "bold",
          fontSizePx: smallSize5,
          fill: textColor,
          textAnchor: "middle",
          lines: [data.date],
          lineHeightPx: smallSize5,
        })
      );
  }

  svgParts.push("</svg>");
  const svgOverlay = Buffer.from(svgParts.join(""));

  // Composite SVG overlay on top of the template image
  const output = await sharp(templatePath)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toBuffer();

  return output;
}

// Helper function for testing with boilerplate data
export async function generateTestCertificate(
  templateName: CertificateData["template"] = "1.png",
  customData?: Partial<CertificateData>
): Promise<string> {
  // Default boilerplate data
  const defaultData: CertificateData = {
    name: "Test User",
    course: "Sample Course",
    instructor: "Test Instructor",
    date: new Date().toISOString().split("T")[0], // Today's date
    template: templateName,
  };

  // Merge with custom data if provided
  const testData = { ...defaultData, ...customData };

  try {
    // Generate the certificate buffer
    const templatePath = join("certificates", templateName);
    const certificateBuffer = await generateCertificate(templatePath, testData);

    // Create testingUploads directory if it doesn't exist
    const testingUploadsDir = "testingUploads";
    try {
      await Bun.file(testingUploadsDir).exists();
    } catch {
      // Directory doesn't exist, create it
      await Bun.write(join(testingUploadsDir, ".gitkeep"), "");
    }

    // Create unique filename for testing
    const timestamp = Date.now();
    const filename = `test_certificate_${testData.name.replace(
      /\s+/g,
      "_"
    )}_${timestamp}.png`;
    const filePath = join(testingUploadsDir, filename);

    // Save the generated certificate
    await Bun.write(filePath, certificateBuffer);

    console.log(`✅ Test certificate generated successfully!`);
    console.log(`📁 Saved to: ${filePath}`);
    console.log(
      `📊 File size: ${(certificateBuffer.length / 1024).toFixed(1)} KB`
    );
    console.log(`📋 Data used:`, testData);

    return filePath;
  } catch (error) {
    console.error("❌ Error generating test certificate:", error);
    throw error;
  }
}

// Helper function to generate multiple test certificates
export async function generateMultipleTestCertificates(
  count: number = 3,
  templateName: CertificateData["template"] = "1.png"
): Promise<string[]> {
  const testNames = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Davis",
    "David Wilson",
    "Eva Brown",
    "Frank Miller",
    "Grace Taylor",
    "Henry Anderson",
  ];

  const testCourses = [
    "Web Development Fundamentals",
    "Advanced JavaScript",
    "React Mastery",
    "Node.js Backend Development",
    "Database Design",
    "UI/UX Design Principles",
    "DevOps Essentials",
    "Mobile App Development",
  ];

  const testInstructors = [
    "Dr. Sarah Chen",
    "Prof. Michael Rodriguez",
    "Ms. Jennifer Lee",
    "Dr. Robert Thompson",
    "Prof. Lisa Garcia",
    "Mr. Kevin Martinez",
    "Dr. Amanda White",
    "Prof. James Johnson",
  ];

  const generatedFiles: string[] = [];

  console.log(`🚀 Generating ${count} test certificates...`);

  for (let i = 0; i < count; i++) {
    const testData: CertificateData = {
      name: testNames[i % testNames.length],
      course: testCourses[i % testCourses.length],
      instructor: testInstructors[i % testInstructors.length],
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Random date within last year
      template: templateName,
    };

    try {
      const filePath = await generateTestCertificate(templateName, testData);
      generatedFiles.push(filePath);
    } catch (error) {
      console.error(`❌ Failed to generate certificate ${i + 1}:`, error);
    }
  }

  console.log(
    `✅ Successfully generated ${generatedFiles.length} test certificates`
  );
  return generatedFiles;
}
