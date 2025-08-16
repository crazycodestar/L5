// Test script for certificate generator utilities
import { generateTestCertificate, generateMultipleTestCertificates } from "./src/utils/certificateGenerator.ts";

async function runTests() {
  console.log("🧪 Testing Certificate Generator Utilities\n");

  try {
    // Test 1: Generate single test certificate with default data
    console.log("📝 Test 1: Generate single test certificate with default data");
    const filePath1 = await generateTestCertificate();
    console.log(`✅ Success: ${filePath1}\n`);

    // Test 2: Generate test certificate with custom data
    console.log("📝 Test 2: Generate test certificate with custom data");
    const customData = {
      name: "Jane Smith",
      course: "Advanced React Development",
      instructor: "Dr. John Doe",
      date: "2024-03-15"
    };
    const filePath2 = await generateTestCertificate("1.png", customData);
    console.log(`✅ Success: ${filePath2}\n`);

    // Test 3: Generate test certificate with different template
    console.log("📝 Test 3: Generate test certificate with template 2.png");
    const filePath3 = await generateTestCertificate("2.png", {
      name: "Mike Johnson",
      course: "Node.js Backend",
      instructor: "Prof. Sarah Wilson"
    });
    console.log(`✅ Success: ${filePath3}\n`);

    // Test 4: Generate multiple test certificates
    console.log("📝 Test 4: Generate multiple test certificates");
    const filePaths = await generateMultipleTestCertificates(5, "1.png");
    console.log(`✅ Successfully generated ${filePaths.length} certificates\n`);

    // Test 5: Test with template 3.png
    console.log("📝 Test 5: Generate certificate with template 3.png");
    const filePath5 = await generateTestCertificate("3.png", {
      name: "Lisa Chen",
      course: "UI/UX Design",
      instructor: "Ms. Emily Brown"
    });
    console.log(`✅ Success: ${filePath5}\n`);

    // Test 6: Test with template 4.png
    console.log("📝 Test 6: Generate certificate with template 4.png");
    const filePath6 = await generateTestCertificate("4.png", {
      name: "Alex Rodriguez",
      course: "DevOps Engineering",
      instructor: "Dr. Michael Taylor"
    });
    console.log(`✅ Success: ${filePath6}\n`);

    console.log("🎉 All tests completed successfully!");
    console.log("📁 Check the 'testingUploads' directory for generated certificates");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the tests
runTests();
