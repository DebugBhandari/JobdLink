import React from "react";
import Avatar from "@mui/material/Avatar";
import "./index.css";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";

const Profile = ({ handleOpen }) => {
  const userName = localStorage.getItem("nameJL");
  const userEmail = localStorage.getItem("emailJL");
  const userImage = localStorage.getItem("imageUrlJL");
  const urlValue = window.location.href;
  return (
    <div className="profileMainDiv">
      <div className="profileCard">
        <div className="profileAvatar">
          <Avatar
            alt={userName}
            src={userImage}
            sx={{ width: 56, height: 56 }}
          />
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}>
            {userName}
          </Typography>
        </div>
        <br></br>
        <Typography sx={{ fontSize: "16px" }}>{userEmail}</Typography>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Typography sx={{ fontSize: "16px" }}>
          Loves Coding and Football.
        </Typography>

        <br></br>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          You dont rise to your goals, you fall to your habits.
        </Typography>
        <br></br>
        <Typography sx={{ fontSize: "16px" }}>Applied: 5</Typography>
        <Typography sx={{ fontSize: "16px" }}>Linked: 1</Typography>
        <br></br>
        <Typography sx={{ fontSize: "16px" }}>Resume.pdf</Typography>
        <br></br>
        <br></br>
        <div className="profileButton">
          {urlValue === "http://localhost:3000/jobs" ? (
            <Button
              onClick={handleOpen}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                width: "50%",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              Add Job
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
