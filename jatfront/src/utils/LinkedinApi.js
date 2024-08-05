import html2canvas from "html2canvas";
import { baseUrl } from "../App";

const captureScreenshot = async (
  ref,
  linkedinId,
  token,
  jobId,
  postComment
) => {
  try {
    const canvas = await html2canvas(ref.current, {
      width: window.scrollWidth,
      height: window.scrollHeight,
      backgroundColor: "white", // Ensure background is not transparent
      useCORS: true, // Handle cross-origin images
      logging: true, // Enable logging for debugging
      scale: 2, // Scale the image up by 2x
    });
    const imgData = canvas.toDataURL("image/png");

    // Convert the base64 string to a file
    const blob = await fetch(imgData).then((res) => res.blob());
    const file = new File([blob], "screenshot.png", { type: "image/png" });

    // Upload the file
    await uploadScreenshot(file, linkedinId, token, jobId, postComment);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
  }
};

const uploadScreenshot = async (
  file,
  linkedinId,
  token,
  jobId,
  postComment
) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log("Screenshot uploaded:", result.url);
    await shareOnLinkedIn(result.url, linkedinId, token, jobId, postComment);
  } catch (error) {
    console.error("Error uploading screenshot:", error);
  }
};

const shareOnLinkedIn = async (
  imageUrl,
  linkedinId,
  token,
  jobId,
  postComment
) => {
  try {
    const response = await fetch(`${baseUrl}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        linkedinId,
        token,
        job_id: jobId,
        postComment,
      }),
    });
    const result = await response.json();
    alert("Shared on LinkedIn!");
    console.log("Shared on LinkedIn:", result);
  } catch (error) {
    console.error("Error sharing on LinkedIn:", error);
  }
};

export default captureScreenshot;
