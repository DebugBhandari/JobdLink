import React from "react";
import Avatar from "@mui/material/Avatar";
import "./index.css";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import useJLStore from "../useStore";
import { baseUrl } from "../App";

const Profile = ({ handleOpen }) => {
  const zUser = useJLStore((state) => state.zUser);
  const urlValue = window.location.href;
  return (
    <div className="profileMainDiv">
      <div className="profileCard">
        <div className="profileAvatar">
          <Avatar
            alt={zUser.name}
            src={zUser.imageUrl}
            sx={{ width: 52, height: 52 }}
          />
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}>
            {zUser.name}
          </Typography>
        </div>
        <br></br>
        <Typography sx={{ fontSize: "16px" }}>{zUser.email}</Typography>

        <br></br>
        <Typography sx={{ fontSize: "16px" }}>
          Loves Coding and Football.
        </Typography>

        <br></br>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          You dont rise to your goals, you fall to your habits.
        </Typography>
        <br></br>
        <br></br>
        <br></br>
        <div className="rowDiv">
          {" "}
          <Typography sx={{ fontSize: "16px" }}>Applied: 5</Typography>
          <Typography sx={{ fontSize: "16px" }}>Linked: 1</Typography>
          <br></br>
          <Typography sx={{ fontSize: "16px" }}>Resume.pdf</Typography>
        </div>
        <br></br>
        <br></br>
        <div className="profileButton">
          {urlValue === `${baseUrl}/jobs` ? (
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
