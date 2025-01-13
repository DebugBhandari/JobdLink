import React from "react";
import Avatar from "@mui/material/Avatar";

// Simple hash function to generate a hash from the name
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color =
    "#" +
    ((hash >> 24) & 0xff).toString(16).padStart(2, "0") +
    ((hash >> 16) & 0xff).toString(16).padStart(2, "0") +
    ((hash >> 8) & 0xff).toString(16).padStart(2, "0");
  return color;
};

const UserAvatar = ({ name, imageUrl, onClick, profileAvatar }) => {
  const fullName = name || "Anonymous User";
  const nameParts = fullName.trim().split(" "); // Trim and split the full name

  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Handle cases with no last name

  // Generate a color based on the first and last name to ensure consistency
  const userNameForColor = firstName + lastName;
  const randomBackground = stringToColor(userNameForColor);
  const randomColor = "#fff"; // White text for contrast
  const avatarSize = profileAvatar ? { xs: 60, md: 80, lg: 100 } : 40;
  const fontSize = profileAvatar ? { xs: 24, md: 32, lg: 40 } : 24;
  const borderSize = profileAvatar ? "4px" : "3px";

  return (
    <Avatar
      alt={`${firstName} ${lastName}`}
      src={imageUrl} // Use job's image URL
      sx={{
        width: avatarSize,
        height: avatarSize,
        backgroundColor: randomBackground, // Consistent background color
        color: randomColor, // Text color
        fontWeight: "bolder",
        border: borderSize + " solid #2a2e45",
        fontSize: fontSize,
      }}
      onClick={onClick}
    >
      {firstName.charAt(0) + lastName.charAt(0)} {/* Initials */}
    </Avatar>
  );
};

export default UserAvatar;
