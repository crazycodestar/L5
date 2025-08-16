// Quick test utility for certificate generation
import { generateTestCertificate } from "./src/utils/certificateGenerator.ts";

// Get command line arguments
const args = process.argv.slice(2);
const templateName = args[0] || "1.png";
const name = args[1] || "Quick Test User";
const course = args[2] || "Quick Test Course";
const instructor = args[3] || "Quick Test Instructor";

console.log("⚡ Quick Certificate Test");
console.log(`Template: ${templateName}`);
console.log(`Name: ${name}`);
console.log(`Course: ${course}`);
console.log(`Instructor: ${instructor}`);
console.log("");

generateTestCertificate(templateName, {
  name,
  course,
  instructor,
  date: new Date().toISOString().split('T')[0]
})
.then(filePath => {
  console.log(`✅ Certificate saved to: ${filePath}`);
})
.catch(error => {
  console.error("❌ Error:", error.message);
});
