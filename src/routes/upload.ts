import { Hono } from "hono";
import { readdir, stat } from "fs/promises";

const uploadRouter = new Hono();

// File upload endpoint
uploadRouter.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file size (optional - 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ error: "File too large. Maximum size is 10MB" }, 400);
    }

    // Get file information
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      url: `${c.req.url.split("/upload")[0]}/files/${file.name}`,
    };

    // Here you would typically save the file to disk or cloud storage
    // For now, we'll just return the file information
    const bytes = await file.arrayBuffer();
    await Bun.write(`uploads/${file.name}`, bytes);

    return c.json({
      message: "File uploaded successfully",
      file: fileInfo,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Failed to process upload" }, 500);
  }
});

// Endpoint to serve uploaded files and images
uploadRouter.get("/files/:filename", async (c) => {
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

    const filePath = `uploads/${filename}`;

    // Check if file exists
    const file = Bun.file(filePath);
    const exists = await file.exists();

    if (!exists) {
      return c.json({ error: "File not found" }, 404);
    }

    // Determine MIME type based on file extension
    const getMimeType = (filename: string) => {
      const ext = filename.split(".").pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
        pdf: "application/pdf",
        txt: "text/plain",
        json: "application/json",
        xml: "application/xml",
        csv: "text/csv",
        mp4: "video/mp4",
        mp3: "audio/mpeg",
        zip: "application/zip",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
      return mimeTypes[ext || ""] || "application/octet-stream";
    };

    const mimeType = getMimeType(filename);

    // Serve the file using Bun's file API
    const arrayBuffer = await file.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=3600",
        "Content-Disposition": mimeType.startsWith("image/")
          ? `inline; filename="${filename}"`
          : `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("File serving error:", error);
    return c.json({ error: "Failed to serve file" }, 500);
  }
});

// Endpoint to list uploaded files
uploadRouter.get("/files", async (c) => {
  try {
    const uploadsDir = "uploads";

    // Read directory contents (this will throw if directory doesn't exist)
    const files = await readdir(uploadsDir, { withFileTypes: true });
    const fileList = [];

    for (const file of files) {
      if (file.isFile()) {
        const filePath = `${uploadsDir}/${file.name}`;
        const stats = await stat(filePath);

        fileList.push({
          name: file.name,
          size: stats.size,
          lastModified: stats.mtimeMs,
          url: `/files/${file.name}`,
        });
      }
    }

    return c.json({
      files: fileList,
      count: fileList.length,
    });
  } catch (error) {
    console.error("File listing error:", error);
    // If directory doesn't exist, return empty list
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return c.json({ files: [], message: "No uploads directory found" });
    }
    return c.json({ error: "Failed to list files" }, 500);
  }
});

export default uploadRouter;
