import axios from "axios";

export const getTokenDetails = async (accessToken) => {
  try {
    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/introspectToken",
      new URLSearchParams({
        token: accessToken,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data; // Contains details like expiresIn, scopes, etc.
  } catch (error) {
    console.error("Error fetching token details:", error.message);
    throw new Error("Failed to fetch token details.");
  }
};
