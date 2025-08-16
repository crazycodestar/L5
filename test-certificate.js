// Test script for certificate generation
const testDataBase = {
  name: "Olalekan Adekanmbi",
  // course: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
  course: "Making it work",
  instructor: "Dr. Jane Smith",
  date: "2024-01-15",
};

async function testCertificateGeneration(testData) {
  try {
    const response = await fetch('http://localhost:8787/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Certificate generated successfully!');
      console.log('File info:', result.file);
      console.log('Download URL:', `http://localhost:8787${result.file.url}`);
    } else {
      console.log('❌ Error generating certificate:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Test available templates
async function testTemplates() {
  try {
    const response = await fetch('http://localhost:8787/templates');
    const result = await response.json();
    
    if (response.ok) {
      console.log('📋 Available templates:', result.templates);
    } else {
      console.log('❌ Error fetching templates:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Clean up test uploads folder
async function cleanTestUploads() {
  try {
    const { exitCode } = await Bun.spawn(["rm", "-rf", "uploads"]);
    if (exitCode === 0) {
      console.log("🧹 Cleaned up uploads directory");
    } else {
      console.log("⚠️ Failed to clean uploads directory");
    }
  } catch (error) {
    console.log("⚠️ Error cleaning uploads:", error.message);
  }
}

// Run tests
console.log('🧪 Testing certificate generation...');
testTemplates().then(() => {
  cleanTestUploads().then(() => {
    ["1.png", "2.png", "3.png", "4.png"].forEach((template) => {
      console.log(`🧪 Testing template: ${template}`);
      testCertificateGeneration({ ...testDataBase, template });
    });
  });
});
