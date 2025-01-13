import axios from "axios";

import fs from "fs";
import path from "path";

export const shareOnLinkedIn = async (
  imageUrn,
  linkedinId,
  accessToken,
  job_id,
  postComment
) => {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${linkedinId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: `${postComment}\n\n` + `https://jobd.link/links/${job_id}`,
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: imageUrn,
                description: {
                  text: "Image description",
                },
                title: {
                  text: "Image Title",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Post shared successfully on LinkedIn!", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sharing on LinkedIn:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to share on LinkedIn.");
  }
};

export const uploadImageToLinkedIn = async (
  imageUrl,
  linkedinId,
  accessToken
) => {
  try {
    const registerUploadResponse = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${linkedinId}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadUrl =
      registerUploadResponse.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = registerUploadResponse.data.value.asset;

    // Convert imageUrl to a file path
    const fileName = path.basename(imageUrl);
    const filePath = path.resolve("uploads", fileName);

    // Read the file from the filesystem
    const imageData = fs.readFileSync(filePath);

    // Upload the image to LinkedIn
    await axios.put(uploadUrl, imageData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/png",
      },
    });

    return asset;
  } catch (error) {
    console.error(
      "Error uploading image to LinkedIn:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to upload image to LinkedIn.");
  }
};
