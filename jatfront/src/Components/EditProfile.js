import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useJLStore from "../useStore";
import { baseUrl } from "../App";
import { useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./index.css";

import UserAvatar from "./UserAvatar";

const EditProfile = ({ handleOpen }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting },
  } = useForm();
  const [editing, setEditing] = useState(false); // Add editing state

  const zUser = useJLStore((state) => state.zUser);
  const activeProfile = useJLStore((state) => state.activeProfile);
  const setActiveProfile = useJLStore((state) => state.setActiveProfile);
  //const zGuestProfile = useJLStore((state) => state.zGuestProfile);
  //const setZGuestProfile = useJLStore((state) => state.setZGuestProfile);

  const locationPath = useLocation();
  const paramsId = parseInt(locationPath.pathname.split("/")[2]);

  const handleLogout = () => {
    // Clear the LinkedIn OAuth token from local storage
    localStorage.removeItem("JLstorage");

    // Redirect to LinkedIn logout URL
    window.location.href = { baseUrl };
  };

  useEffect(() => {
    setActiveProfile(paramsId);
    //setZGuestProfile(paramsId);
  }, [paramsId]);

  useEffect(() => {
    if (activeProfile) {
      reset({
        bio: activeProfile.bio || "",
        location: activeProfile.location || "",
        website: activeProfile.website || "",
        github: activeProfile.github || "",
        linkedin: activeProfile.linkedin || "",
        partialView: activeProfile.partialView || "",
      });
    }
  }, [activeProfile, reset]);

  const onSubmit = async (data) => {
    try {
      const url = activeProfile
        ? `${baseUrl}/profile/${activeProfile.id}`
        : `${baseUrl}/profile`;
      const method = activeProfile ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${zUser.token}`,
        },
        body: JSON.stringify({
          ...data,
          user_id: parseInt(zUser.id),
        }),
      });

      setEditing(false); // Exit edit mode after saving
      setActiveProfile(paramsId); // Refresh profile data
      window.location.href = `/userProfile/${zUser.id}`;
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    if (activeProfile) {
      reset({
        bio: activeProfile.bio || "",
        location: activeProfile.location || "",
        website: activeProfile.website || "",
        github: activeProfile.github || "",
        linkedin: activeProfile.linkedin || "",
        partialView: activeProfile.partialView ? 1 : 0,
      });
    }
    window.location.href = `/userProfile/${zUser.id}`;
    setEditing(false); // Exit edit mode on cancel
  };

  return (
    <div
      className="editProfileMainDiv"
      style={{ backgroundColor: "#f5f5f5", padding: "8px" }}
    >
      {activeProfile?.name ? (
        <div className="profileCard">
          <div className="profileAvatar">
            <div className="profileAvatarCard">
              <UserAvatar
                name={activeProfile.name}
                imageUrl={activeProfile.imageUrl}
                profileAvatar={1}
              />
              <div className="profileAvatarDiv">
                <Typography
                  sx={{
                    fontSize: { sx: "24px", md: "36px", lg: "44px" },
                    fontWeight: "bold",
                  }}
                >
                  {activeProfile.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { sx: "20px", md: "28px", lg: "32px" },
                    color: "grey",
                    wordBreak: "break-word",
                  }}
                >
                  {activeProfile.email}
                </Typography>
              </div>
            </div>
          </div>
          <div className="profileContentDiv">
            <div className="rowDivProfile"></div>
            <br />
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bio"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
              )}
            />

            <br />

            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Portfolio"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <div className="rowDivProfile">
              <Controller
                name="github"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Github"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              />

              <Controller
                name="linkedin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Linkedin"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </div>
            <br />

            <br />
            <div className="centreDiv">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                sx={{
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: "bolder",
                  backgroundColor: "#2a2e45",
                  width: "120px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  padding: "6px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#2a2e45",
                  },
                }}
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                sx={{
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: "bolder",
                  backgroundColor: "#2a2e45",
                  width: "120px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  padding: "6px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#2a2e45",
                  },
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EditProfile;
