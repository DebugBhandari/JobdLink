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
  const zProfile = useJLStore((state) => state.zProfile);
  const setZProfile = useJLStore((state) => state.setZProfile);
  const zGuestProfile = useJLStore((state) => state.zGuestProfile);
  const setZGuestProfile = useJLStore((state) => state.setZGuestProfile);

  const locationPath = useLocation();
  const paramsId = parseInt(locationPath.pathname.split("/")[2]);

  const handleLogout = () => {
    // Clear the LinkedIn OAuth token from local storage
    localStorage.removeItem("JLstorage");

    // Redirect to LinkedIn logout URL
    window.location.href = { baseUrl };
  };

  useEffect(() => {
    setZProfile(paramsId);
    setZGuestProfile(paramsId);
  }, [paramsId, setZProfile]);

  useEffect(() => {
    if (zGuestProfile) {
      reset({
        bio: zGuestProfile.bio || "",
        location: zGuestProfile.location || "",
        website: zGuestProfile.website || "",
        github: zGuestProfile.github || "",
        linkedin: zGuestProfile.linkedin || "",
        partialView: zGuestProfile.partialView || "",
      });
    }
  }, [zProfile, reset]);

  const onSubmit = async (data) => {
    try {
      const url = zProfile
        ? `${baseUrl}/profile/${zProfile.id}`
        : `${baseUrl}/profile`;
      const method = zProfile ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          user_id: parseInt(zUser.id),
        }),
      });

      setEditing(false); // Exit edit mode after saving
      setZProfile(paramsId); // Refresh profile data
      window.location.href = `/userProfile/${zUser.id}`;
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    if (zProfile) {
      reset({
        bio: zProfile.bio || "",
        location: zProfile.location || "",
        website: zProfile.website || "",
        github: zProfile.github || "",
        linkedin: zProfile.linkedin || "",
        partialView: zProfile.partialView ? 1 : 0,
      });
    }
    window.location.href = `/userProfile/${zUser.id}`;
    setEditing(false); // Exit edit mode on cancel
  };
  console.log("zProfile", zGuestProfile);

  return (
    <div className="profileMainDiv">
      {zGuestProfile?.name ? (
        <div className="profileCard">
          <div className="profileAvatar">
            <Avatar
              alt={zGuestProfile.name}
              src={zGuestProfile.imageUrl}
              sx={{ width: 52, height: 52 }}
            />
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}
            >
              {zGuestProfile.name}
            </Typography>
          </div>
          <div className="profileContentDiv">
            <div className="rowDivProfile">
              <h1 className="avatarTitle">{zGuestProfile.email}</h1>
            </div>
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
            <div className="rowDivProfile">
              <h1 className="headerNormalText">
                Linked:{" "}
                {zGuestProfile.partialView
                  ? "Hidden"
                  : zGuestProfile.count_jobs_linkd}
              </h1>
              <h1 className="headerNormalText">
                Total:{" "}
                {zGuestProfile.partialView
                  ? "Hidden"
                  : zGuestProfile.count_jobs}
              </h1>
            </div>

            <br />
            <div className="centreDiv">
              <div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EditProfile;
