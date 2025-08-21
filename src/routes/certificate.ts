import { Hono } from "hono";
import { readdir } from "fs/promises";
import { join } from "path";
import {
  generateCertificate,
  CertificateData,
} from "../utils/certificateGenerator";

const certificateRouter = new Hono();

// Function to get available certificate templates
async function getAvailableTemplates(): Promise<string[]> {
  try {
    const certificatesDir = "certificates";
    const files = await readdir(certificatesDir);
    return files.filter((file) => file.endsWith(".png")).sort();
  } catch (error) {
    console.error("Error reading certificates directory:", error);
    return ["1.png"]; // Default fallback
  }
}

// Endpoint to generate certificate
certificateRouter.post("/generate", async (c) => {
  try {
    const body = (await c.req.json()) as CertificateData;

    // Validate required fields
    if (!body.name || !body.course || !body.instructor || !body.date) {
      return c.json(
        {
          error: "Missing required fields: name, course, instructor, date",
        },
        400
      );
    }

    // Get available templates
    const templates = await getAvailableTemplates();

    // Use specified template or default to first available
    const templateName = body.template || templates[0];
    const templatePath = join("certificates", templateName);

    // Check if template exists
    try {
      await Bun.file(templatePath).exists();
    } catch {
      return c.json(
        {
          error: `Template ${templateName} not found. Available templates: ${templates.join(
            ", "
          )}`,
        },
        404
      );
    }

    // Generate certificate
    const certificateBuffer = await generateCertificate(templatePath, body);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `certificate_${body.name.replace(
      /\s+/g,
      "_"
    )}_${timestamp}.png`;
    const filePath = join("uploads", filename);

    // Save the generated certificate
    await Bun.write(filePath, certificateBuffer);

    // Get file stats
    const stats = await Bun.file(filePath).size;

    // Return file information
    return c.json({
      message: "Certificate generated successfully",
      file: {
        name: filename,
        size: stats,
        type: "image/png",
        url: `${c.req.url.split("/generate")[0]}/files/${filename}`,
        template: templateName,
        data: body,
      },
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return c.json(
      {
        error: "Failed to generate certificate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Endpoint to list available certificate templates
certificateRouter.get("/templates", async (c) => {
  try {
    const templates = await getAvailableTemplates();

    return c.json({
      templates: templates.map((template) => ({
        name: template,
        url: `/certificates/${template}`,
      })),
      count: templates.length,
    });
  } catch (error) {
    console.error("Template listing error:", error);
    return c.json(
      {
        error: "Failed to list templates",
      },
      500
    );
  }
});

// Endpoint to serve certificate templates
certificateRouter.get("/certificates/:filename", async (c) => {
  try {
    const filename = c.req.param("filename");

    if (!filename) {
      return c.json({ error: "Filename is required" }, 400);
    }

    // Security: Prevent directory traversal
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return c.json({ error: "Invalid filename" }, 400);
    }

    const filePath = `certificates/${filename}`;
    const file = Bun.file(filePath);
    const exists = await file.exists();

    if (!exists) {
      return c.json({ error: "Template not found" }, 404);
    }

    const arrayBuffer = await file.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Template serving error:", error);
    return c.json({ error: "Failed to serve template" }, 500);
  }
});

export default certificateRouter;
