import fs from "fs";
import path from "path";
import axios from "axios";
import { dockerUrl } from "./tailorCv.js";
const aichat = async (req, res) => {
  const { message } = req.body;

  try {
    // Make the API request to Llama2 with streaming response
    const llamaResponse = await axios.post(
      dockerUrl, // Correct endpoint for your Llama2 API
      {
        model: "llama3.2:3b", // Adjust model if necessary
        prompt: message,
        parameters: {
            temperature: 0.7,
            max_tokens: 1500,
          },
      },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "stream", // Stream to get the response incrementally
        timeout: 10000, 
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
    console.error("Error connecting Llama3.2:", error.message);
    res.status(500).json({ error: "Failed to connect to Ollama." });
  }
};

export default aichat;
