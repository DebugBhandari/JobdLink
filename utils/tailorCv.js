import fs from "fs";
import path from "path";
import axios from "axios";
import pdfParse from "pdf-parse";
import cvServices from "../services/cvServices.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const dockerUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:11434/api/generate"
    : "http://ollama:11434/api/generate";

const tailorCv = async (req, res) => {
  const { userId, jobDescription } = req.body;

  try {
    // Step 1: Retrieve CV file path from the database
    const [rows] = await cvServices.findCvFilename(userId);
    console.log("Database query result:", rows);

    if (!rows || rows.length === 0 || !rows[0].cv_file) {
      return res.status(404).json({
        error: "CV not found for the user. Upload a CV PDF in Profile.",
      });
    }

    const cvFileName = rows[0].cv_file;
    console.log("CV file name:", cvFileName);

    // Adjust path resolution to the project root
    const rootDir = path.resolve(__dirname, "../"); // Adjust this based on your project structure
    const cvFilePath = path.join(rootDir, "uploads", "cvs", cvFileName);
    console.log("CV file path:", cvFilePath);

    if (!fs.existsSync(cvFilePath)) {
      return res
        .status(404)
        .json({ error: "CV does not exist on the server." });
    }

    // Step 2: Extract text from the CV PDF file
    const fileBuffer = fs.readFileSync(cvFilePath);
    const pdfData = await pdfParse(fileBuffer);
    const cvText = pdfData.text;
    console.log("Extracted CV Text:", cvText);

    if (!cvText || cvText.trim() === "") {
      return res.status(400).json({ error: "Failed to extract text from CV." });
    }

    console.log("Extracted CV Text:", cvText); // Log extracted CV text for debugging

    // Step 3: Generate tailored CV using Llama2
    const prompt = `
Given the following My CV, extract my information in detail and tailor it for the target job description:

### My CV:
${cvText}

### Target Job Description:
${jobDescription}

### Output:
I am applying for the target job and do not work there yet.
Output a CV that is tailored to the target job description. Make it
 look like a human-written CV and not a letter.
Make sure not a letter. Use the actual data from My CV. Use the real
name and real email and real phone number from My CV. Remember to put emphasis
on My CV's data.
    `;

    // Make the API request to Llama2 with streaming response
    const llamaResponse = await axios.post(
      dockerUrl, // Correct endpoint for your Llama2 API
      {
        model: "llama3.2:3b", // Adjust model if necessary
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "stream", // Stream to get the response incrementally
      }
    );

    // Handle streamed response from Llama2 API
    let fullResponse = "";
    llamaResponse.data.on("data", (chunk) => {
      try {
        const chunkString = chunk.toString();
        const chunkData = JSON.parse(chunkString); // Handle streaming JSON response
        fullResponse += chunkData.response;
        res.write(chunkData.response); // Send partial response as data streams in
      } catch (error) {
        console.error("Error processing chunk:", error);
        res.write("Error processing response chunk.");
      }
    });

    llamaResponse.data.on("end", () => {
      res.end(); // End the response stream once it's finished
    });

    llamaResponse.data.on("error", (err) => {
      console.error("Stream error:", err);
      res.write("Error processing response.");
      res.end();
    });
  } catch (error) {
    console.error("Error tailoring CV:", error.message);
    res.status(500).json({ error: "Failed to tailor CV." });
  }
};

export default tailorCv;
