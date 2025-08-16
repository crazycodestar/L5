# L5 Certificate Generator

A Node.js/Bun application that generates certificates by overlaying text on certificate templates.

## Features

- Generate certificates from PNG templates
- Support for multiple certificate templates
- Text overlay with customizable positioning
- File storage in uploads directory
- RESTful API endpoints

## Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

The server will run on `http://localhost:8787`

## API Endpoints

### Generate Certificate

**POST** `/generate`

Generates a certificate with the provided data and saves it to the uploads directory.

**Request Body:**
```json
{
  "name": "John Doe",
  "course": "Advanced Web Development",
  "instructor": "Dr. Jane Smith",
  "date": "2024-01-15",
  "template": "1.png"  // Optional: specify template (defaults to first available)
}
```

**Response:**
```json
{
  "message": "Certificate generated successfully",
  "file": {
    "name": "certificate_John_Doe_1705123456789.png",
    "size": 123456,
    "type": "image/png",
    "url": "/files/certificate_John_Doe_1705123456789.png",
    "template": "1.png",
    "data": {
      "name": "John Doe",
      "course": "Advanced Web Development",
      "instructor": "Dr. Jane Smith",
      "date": "2024-01-15"
    }
  }
}
```

### List Available Templates

**GET** `/templates`

Returns a list of available certificate templates.

**Response:**
```json
{
  "templates": [
    {
      "name": "1.png",
      "url": "/certificates/1.png"
    },
    {
      "name": "2.png",
      "url": "/certificates/2.png"
    }
  ],
  "count": 2
}
```

### View Template

**GET** `/certificates/:filename`

Serves a certificate template image.

### Download Generated Certificate

**GET** `/files/:filename`

Downloads a generated certificate from the uploads directory.

## File Structure

```
L5/
├── certificates/          # Certificate templates (PNG files)
│   ├── 1.png
│   ├── 2.png
│   ├── 3.png
│   └── 4.png
├── uploads/              # Generated certificates
├── src/
│   ├── index.ts         # Main application entry point
│   └── routes/
│       ├── upload.ts    # File upload endpoints
│       └── certificate.ts # Certificate generation endpoints
└── package.json
```

## Testing

### API Testing
Run the test script to verify the API:

```bash
bun run test-certificate.js
```

### Certificate Generator Utilities
Test the certificate generation utilities directly:

```bash
# Run comprehensive tests
bun run test:generator

# Quick test with custom data
bun run quick-test.js [template] [name] [course] [instructor]

# Examples:
bun run quick-test.js 1.png "John Doe" "Web Development" "Dr. Smith"
bun run quick-test.js 2.png "Jane Smith" "React Course" "Prof. Johnson"
```

### Utility Functions

The certificate generator utilities are available in `src/utils/certificateGenerator.ts`:

```typescript
import { 
  generateTestCertificate, 
  generateMultipleTestCertificates,
  CertificateData 
} from "./src/utils/certificateGenerator.ts";

// Generate single test certificate
const filePath = await generateTestCertificate("1.png", {
  name: "John Doe",
  course: "Web Development",
  instructor: "Dr. Smith"
});

// Generate multiple test certificates
const filePaths = await generateMultipleTestCertificates(5, "1.png");
```

Generated test certificates are saved to the `testingUploads/` directory.

## Certificate Template Format

The application supports 4 different certificate templates with template-specific positioning and styling:

### Template-Specific Features

**Templates 1.png, 2.png, 3.png:**
- **Text Color**: Black (`#000000`)
- **Font Sizes**: Large (72px), Medium (56px), Small (32px)
- **Bold styling** for all text elements

**Template 4.png:**
- **Text Color**: White (`#FFFFFF`)
- **Font Sizes**: Large (72px), Medium (56px), Small (32px)
- **Bold styling** for all text elements

### Text Positioning

Each template has optimized positioning for the certificate layout:

- **Recipient Name**: Large font, centered horizontally, positioned at 42-48% of canvas height
- **Course Name**: Medium font, centered horizontally, positioned at 55-62% of canvas height
- **Instructor**: Small font, left side, positioned at 75-82% of canvas height
- **Date**: Small font, right side, positioned at 75-82% of canvas height

The exact positioning varies by template to accommodate different certificate designs and layouts.

## Dependencies

- **Hono**: Web framework
- **Canvas**: Image processing and text overlay
- **Sharp**: Image manipulation (installed but not currently used)
- **Bun**: JavaScript runtime

## Error Handling

The API includes comprehensive error handling for:

- Missing required fields
- Invalid template names
- File system errors
- Image processing errors
- Directory traversal attacks
