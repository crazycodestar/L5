import { join } from "path";
import sharp from "sharp";

// Interface for certificate data
export interface CertificateData {
  name: string;
  course: string;
  instructor: string;
  date: string;
  template?: "1.png" | "2.png" | "3.png" | "4.png";
}

// Helper function to wrap text
function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string = "Arial"
): string[] {
  // Approximate character width (this is a rough estimation)
  const avgCharWidth = fontSize * 0.6;
  const maxChars = Math.floor(maxWidth / avgCharWidth);

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + " " + word;

    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);
  return lines;
}

// Helper function to create SVG text element
function createSVGText(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  fontWeight: string = "normal",
  textAnchor: string = "middle",
  fill: string = "#000000"
): string {
  return `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="${textAnchor}" fill="${fill}">${text}</text>`;
}

// Helper function to create SVG text with wrapping
function createWrappedSVGText(
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  fontWeight: string = "normal",
  textAnchor: string = "middle",
  fill: string = "#000000",
  lineHeight: number = fontSize * 1.2
): string {
  const lines = wrapText(text, maxWidth, fontSize, fontFamily);
  let svgText = "";

  for (let i = 0; i < lines.length; i++) {
    const lineY = y + i * lineHeight;
    svgText += createSVGText(
      lines[i],
      x,
      lineY,
      fontSize,
      fontFamily,
      fontWeight,
      textAnchor,
      fill
    );
  }

  return svgText;
}

// Function to generate certificate with text overlay
export async function generateCertificate(
  templatePath: string,
  data: CertificateData
): Promise<Buffer> {
  // Load the certificate template
  const templateBuffer = await Bun.file(templatePath).arrayBuffer();

  // Extract template name from path to determine styling
  const templateName = templatePath.split("/").pop() || "1.png";

  // Get template dimensions (we'll use a standard size for now)
  const templateWidth = 2480; // Standard A4 width at 300 DPI
  const templateHeight = 3508; // Standard A4 height at 300 DPI

  // Set text color based on template
  const textColor = templateName === "4.png" ? "#FFFFFF" : "#000000";

  const centerX = templateWidth / 2;

  // Template-specific positioning and styling
  let svgTextElements = "";

  switch (templateName) {
    case "1.png":
      // Template 1: Standard layout
      const nameY1 = templateHeight * 0.58;
      const courseY1 = templateHeight * 0.72;
      const instructorY1 = templateHeight * 0.84;
      const dateY1 = templateHeight * 0.84;
      const instructorX1 = templateWidth * 0.255;
      const dateX1 = templateWidth * 0.75;

      // Draw recipient name
      svgTextElements += createSVGText(
        data.name,
        centerX,
        nameY1,
        120,
        "Dancing Script, Brush Script MT, cursive",
        "normal",
        "middle",
        textColor
      );

      // Draw course name with wrapping
      const courseMaxWidth1 = templateWidth * 0.8;
      svgTextElements += createWrappedSVGText(
        data.course,
        centerX,
        courseY1,
        courseMaxWidth1,
        80,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor,
        100
      );

      // Draw instructor name
      svgTextElements += createSVGText(
        data.instructor,
        instructorX1,
        instructorY1,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );

      // Draw date
      svgTextElements += createSVGText(
        data.date,
        dateX1,
        dateY1,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );
      break;

    case "2.png":
      // Template 2: Different positioning
      const nameY2 = templateHeight * 0.545;
      const courseY2 = templateHeight * 0.69;
      const instructorY2 = templateHeight * 0.85;
      const dateY2 = templateHeight * 0.85;
      const instructorX2 = templateWidth * 0.375;
      const dateX2 = templateWidth * 0.632;

      svgTextElements += createSVGText(
        data.name,
        centerX,
        nameY2,
        120,
        "Dancing Script, Brush Script MT, cursive",
        "normal",
        "middle",
        textColor
      );

      const courseMaxWidth2 = templateWidth * 0.8;
      svgTextElements += createWrappedSVGText(
        data.course,
        centerX,
        courseY2,
        courseMaxWidth2,
        80,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor,
        100
      );

      svgTextElements += createSVGText(
        data.instructor,
        instructorX2,
        instructorY2,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );

      svgTextElements += createSVGText(
        data.date,
        dateX2,
        dateY2,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );
      break;

    case "3.png":
      // Template 3: Different positioning
      const nameY3 = templateHeight * 0.52;
      const courseY3 = templateHeight * 0.67;
      const instructorY3 = templateHeight * 0.79;
      const dateY3 = templateHeight * 0.79;
      const instructorX3 = templateWidth * 0.25;
      const dateX3 = templateWidth * 0.765;

      svgTextElements += createSVGText(
        data.name,
        centerX,
        nameY3,
        100,
        "Dancing Script, Brush Script MT, cursive",
        "normal",
        "middle",
        textColor
      );

      const courseMaxWidth3 = templateWidth * 0.8;
      svgTextElements += createWrappedSVGText(
        data.course,
        centerX,
        courseY3,
        courseMaxWidth3,
        80,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor,
        100
      );

      svgTextElements += createSVGText(
        data.instructor,
        instructorX3,
        instructorY3,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );

      svgTextElements += createSVGText(
        data.date,
        dateX3,
        dateY3,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );
      break;

    case "4.png":
      // Template 4: White text, different positioning
      const nameY4 = templateHeight * 0.49;
      const courseY4 = templateHeight * 0.65;
      const instructorY4 = templateHeight * 0.785;
      const dateY4 = templateHeight * 0.785;
      const instructorX4 = templateWidth * 0.316;
      const dateX4 = templateWidth * 0.685;

      svgTextElements += createSVGText(
        data.name,
        centerX,
        nameY4,
        100,
        "Dancing Script, Brush Script MT, cursive",
        "normal",
        "middle",
        textColor
      );

      const courseMaxWidth4 = templateWidth * 0.8;
      svgTextElements += createWrappedSVGText(
        data.course,
        centerX,
        courseY4,
        courseMaxWidth4,
        80,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor,
        100
      );

      svgTextElements += createSVGText(
        data.instructor,
        instructorX4,
        instructorY4,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );

      svgTextElements += createSVGText(
        data.date,
        dateX4,
        dateY4,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );
      break;

    default:
      // Fallback for unknown templates
      const nameY = templateHeight * 0.45;
      const courseY = templateHeight * 0.55;
      const instructorY = templateHeight * 0.75;
      const dateY = templateHeight * 0.75;
      const instructorX = templateWidth * 0.3;
      const dateX = templateWidth * 0.7;

      svgTextElements += createSVGText(
        data.name,
        centerX,
        nameY,
        80,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );

      const courseMaxWidth5 = templateWidth * 0.8;
      svgTextElements += createWrappedSVGText(
        data.course,
        centerX,
        courseY,
        courseMaxWidth5,
        80,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor,
        100
      );

      svgTextElements += createSVGText(
        data.instructor,
        instructorX,
        instructorY,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );

      svgTextElements += createSVGText(
        data.date,
        dateX,
        dateY,
        50,
        "Arial, sans-serif",
        "bold",
        "middle",
        textColor
      );
  }

  // Create SVG overlay
  const svgOverlay = `
    <svg width="${templateWidth}" height="${templateHeight}" xmlns="http://www.w3.org/2000/svg">
      ${svgTextElements}
    </svg>
  `;

  // Use sharp to composite the template with the SVG overlay
  const certificateBuffer = await sharp(Buffer.from(templateBuffer))
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  return certificateBuffer;
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
