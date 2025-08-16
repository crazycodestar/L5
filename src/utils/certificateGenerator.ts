import { createCanvas, loadImage } from "canvas";
import { join } from "path";

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
  ctx: any,
  text: string,
  maxWidth: number,
  lineHeight: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);
  return lines;
}

// Helper function to draw wrapped text
function drawWrappedText(
  ctx: any,
  text: string,
  maxWidth: number,
  lineHeight: number,
  noWrap: {
    x: number;
    y: number;
    font: string;
  },
  wrap: {
    x: number;
    y: number;
    font: string;
  }
): void {
  const lines = wrapText(ctx, text, maxWidth, lineHeight);
  ctx.font = lines.length > 1 ? wrap.font : noWrap.font;

  for (let i = 0; i < lines.length; i++) {
    const lineY = (lines.length > 1 ? wrap.y : noWrap.y) + i * lineHeight;
    ctx.fillText(lines[i], lines.length > 1 ? wrap.x : noWrap.x, lineY);
  }
}

// Function to generate certificate with text overlay
export async function generateCertificate(
  templatePath: string,
  data: CertificateData
): Promise<Buffer> {
  // Load the certificate template
  const template = await loadImage(templatePath);

  // Create canvas with template dimensions
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  // Draw the template as background
  ctx.drawImage(template, 0, 0);

  // Extract template name from path to determine styling
  const templateName = templatePath.split("/").pop() || "1.png";

  // Set text color based on template
  const textColor = templateName === "4.png" ? "#FFFFFF" : "#000000";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";

  const centerX = canvas.width / 2;

  // Template-specific positioning and styling
  switch (templateName) {
    case "1.png":
      // Configure fonts with larger sizes
      const largeFont = "500px 'Dancing Script', 'Brush Script MT', cursive";
      const mediumFont = "bold 280px Arial, sans-serif";
      const regularFont = "bold 200px Arial, sans-serif";
      const smallFont = "bold 160px Arial, sans-serif";

      // Template 1: Standard layout with larger text
      const nameY1 = canvas.height * 0.58;
      const courseY1 = canvas.height * 0.72;
      const instructorY1 = canvas.height * 0.84;
      const dateY1 = canvas.height * 0.84;
      const instructorX1 = canvas.width * 0.255;
      const dateX1 = canvas.width * 0.75;

      // Draw recipient name
      ctx.font = largeFont;
      ctx.fillText(data.name, centerX, nameY1);

      // Draw course name with wrapping
      ctx.font = mediumFont;
      const courseMaxWidth1 = canvas.width * 0.8; // 80% of canvas width
      const courseLineHeight1 = 240; // Slightly larger than font size
      drawWrappedText(
        ctx,
        data.course,
        courseMaxWidth1,
        courseLineHeight1,
        {
          x: centerX,
          y: courseY1,
          font: mediumFont,
        },
        {
          x: centerX,
          y: canvas.height * 0.7,
          font: regularFont,
        }
      );

      // Draw instructor name
      ctx.font = smallFont;
      ctx.fillText(data.instructor, instructorX1, instructorY1);

      // Draw date
      ctx.font = smallFont;
      ctx.fillText(data.date, dateX1, dateY1);
      break;

    case "2.png":
      // Configure fonts with larger sizes
      const largeFont2 = "500px 'Dancing Script', 'Brush Script MT', cursive";
      const mediumFont2 = "bold 280px Arial, sans-serif";
      const regularFont2 = "bold 200px Arial, sans-serif";
      const smallFont2 = "bold 160px Arial, sans-serif";

      // Template 2: Different positioning
      const nameY2 = canvas.height * 0.545;
      const courseY2 = canvas.height * 0.69;
      const instructorY2 = canvas.height * 0.85;
      const dateY2 = canvas.height * 0.85;
      const instructorX2 = canvas.width * 0.375;
      const dateX2 = canvas.width * 0.632;

      // Draw recipient name
      ctx.font = largeFont2;
      ctx.fillText(data.name, centerX, nameY2);

      // Draw course name with wrapping
      ctx.font = mediumFont2;
      const courseMaxWidth2 = canvas.width * 0.8;
      const courseLineHeight2 = 240;
      drawWrappedText(
        ctx,
        data.course,
        courseMaxWidth2,
        courseLineHeight2,
        {
          x: centerX,
          y: courseY2,
          font: mediumFont2,
        },
        {
          x: centerX,
          y: canvas.height * 0.67,
          font: regularFont2,
        }
      );

      // Draw instructor name
      ctx.font = smallFont2;
      ctx.fillText(data.instructor, instructorX2, instructorY2);

      // Draw date
      ctx.font = smallFont2;
      ctx.fillText(data.date, dateX2, dateY2);
      break;

    case "3.png":
      // Configure fonts with larger sizes
      const largeFont3 = "400px 'Dancing Script', 'Brush Script MT', cursive";
      const mediumFont3 = "bold 280px Arial, sans-serif";
      const regularFont3 = "bold 200px Arial, sans-serif";
      const smallFont3 = "bold 160px Arial, sans-serif";

      // Template 3: Different positioning
      const nameY3 = canvas.height * 0.52;
      const courseY3 = canvas.height * 0.67;
      const instructorY3 = canvas.height * 0.79;
      const dateY3 = canvas.height * 0.79;
      const instructorX3 = canvas.width * 0.25;
      const dateX3 = canvas.width * 0.765;

      // Draw recipient name
      ctx.font = largeFont3;
      ctx.fillText(data.name, centerX, nameY3);

      // Draw course name with wrapping
      ctx.font = mediumFont3;
      const courseMaxWidth3 = canvas.width * 0.8;
      const courseLineHeight3 = 240;
      drawWrappedText(
        ctx,
        data.course,
        courseMaxWidth3,
        courseLineHeight3,
        {
          x: centerX,
          y: courseY3,
          font: mediumFont3,
        },
        {
          x: centerX,
          y: canvas.height * 0.65,
          font: regularFont3,
        }
      );

      // Draw instructor name
      ctx.font = smallFont3;
      ctx.fillText(data.instructor, instructorX3, instructorY3);

      // Draw date
      ctx.font = smallFont3;
      ctx.fillText(data.date, dateX3, dateY3);
      break;

    case "4.png":
      // Configure fonts with larger sizes
      const largeFont4 = "400px 'Dancing Script', 'Brush Script MT', cursive";
      const mediumFont4 = "bold 280px Arial, sans-serif";
      const regularFont4 = "bold 200px Arial, sans-serif";
      const smallFont4 = "bold 160px Arial, sans-serif";

      // Template 4: White text, different positioning
      const nameY4 = canvas.height * 0.49;
      const courseY4 = canvas.height * 0.65;
      const instructorY4 = canvas.height * 0.785;
      const dateY4 = canvas.height * 0.785;
      const instructorX4 = canvas.width * 0.316;
      const dateX4 = canvas.width * 0.685;

      // Draw recipient name
      ctx.font = largeFont4;
      ctx.fillText(data.name, centerX, nameY4);

      // Draw course name with wrapping
      ctx.font = mediumFont4;
      const courseMaxWidth4 = canvas.width * 0.8;
      const courseLineHeight4 = 240;
      drawWrappedText(
        ctx,
        data.course,
        courseMaxWidth4,
        courseLineHeight4,
        {
          x: centerX,
          y: courseY4,
          font: mediumFont4,
        },
        {
          x: centerX,
          y: canvas.height * 0.63,
          font: regularFont4,
        }
      );

      // Draw instructor name
      ctx.font = smallFont4;
      ctx.fillText(data.instructor, instructorX4, instructorY4);

      // Draw date
      ctx.font = smallFont4;
      ctx.fillText(data.date, dateX4, dateY4);
      break;

    default:
      // Configure fonts with larger sizes
      const largeFont5 = "bold 300px Arial, sans-serif";
      const mediumFont5 = "bold 280px Arial, sans-serif";
      const regularFont5 = "bold 120px Arial, sans-serif";
      const smallFont5 = "bold 160px Arial, sans-serif";

      // Fallback for unknown templates
      const nameY = canvas.height * 0.45;
      const courseY = canvas.height * 0.55;
      const instructorY = canvas.height * 0.75;
      const dateY = canvas.height * 0.75;
      const instructorX = canvas.width * 0.3;
      const dateX = canvas.width * 0.7;

      ctx.font = largeFont5;
      ctx.fillText(data.name, centerX, nameY);

      // Draw course name with wrapping
      ctx.font = mediumFont5;
      const courseMaxWidth5 = canvas.width * 0.8;
      const courseLineHeight5 = 240;
      drawWrappedText(
        ctx,
        data.course,
        courseMaxWidth5,
        courseLineHeight5,
        {
          x: centerX,
          y: courseY,
          font: mediumFont5,
        },
        {
          x: centerX,
          y: courseY,
          font: regularFont5,
        }
      );

      ctx.font = smallFont5;
      ctx.fillText(data.instructor, instructorX, instructorY);

      ctx.font = smallFont5;
      ctx.fillText(data.date, dateX, dateY);
  }

  // Return the canvas as a PNG buffer
  return canvas.toBuffer("image/png");
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
