import html2canvas from "html2canvas";
import { baseUrl } from "../App";

export const uploadScreenshot = async (
  file,
  linkedinId,
  token,
  jobId,

  setIsModalOpen,
  setUploadedImageUrl
) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const result = await response.json();
    setUploadedImageUrl(result.url);
    setIsModalOpen(true);

    console.log("Screenshot uploaded:", result.url);
  } catch (error) {
    console.error("Error uploading screenshot:", error);
  }
};

export const shareOnLinkedIn = async (
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
        Authorization: "Bearer " + token,
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
