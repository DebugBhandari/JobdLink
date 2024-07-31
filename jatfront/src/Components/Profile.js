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

const Profile = ({ handleOpen }) => {
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
  const zGuestUser = useJLStore((state) => state.zGuestUser);
  const setZGuestUser = useJLStore((state) => state.setZGuestUser);

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
    setZGuestUser(paramsId);
  }, [paramsId, setZProfile]);

  useEffect(() => {
    if (zProfile) {
      reset({
        bio: zProfile.bio || "",
        location: zProfile.location || "",
        website: zProfile.website || "",
        github: zProfile.github || "",
        linkedin: zProfile.linkedin || "",
        partialView: zProfile.partialView ? true : false,
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
        partialView: zProfile.partialView ? "true" : "false",
      });
    }
    setEditing(false); // Exit edit mode on cancel
  };

  return (
    <div className="profileMainDiv">
      {zProfile?.count_jobs ? (
        // Profile exists, show profile details and edit option
        <div className="profileCard">
          <div className="profileAvatar">
            <Avatar
              alt={zProfile.name}
              src={zProfile.imageUrl}
              sx={{ width: 52, height: 52 }}
            />
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}
            >
              {zProfile.name}
            </Typography>
          </div>

          <div className="rowDivProfile">
            <h1 className="avatarTitle">{zProfile.email}</h1>
            {editing ? (
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
            ) : (
              <h1 className="avatarTitle">{zProfile.location}</h1>
            )}
          </div>
          <br />
          {editing ? (
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
          ) : (
            <h1 className="headerGreyText">{zProfile.bio}</h1>
          )}
          <br />
          {editing ? (
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
          ) : (
            <Typography sx={{ fontSize: "16px" }}>
              Portfolio: {zProfile.partialView ? "Hidden" : zProfile.website}
            </Typography>
          )}
          <div className="rowDivProfile">
            {editing ? (
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
            ) : (
              <Typography
                sx={{
                  fontSize: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <GitHubIcon />
                {zProfile.partialView ? "Hidden" : zProfile.github}
              </Typography>
            )}
            {editing ? (
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
            ) : (
              <Typography
                sx={{
                  fontSize: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LinkedInIcon />
                {zProfile.partialView ? "Hidden" : zProfile.linkedin}
              </Typography>
            )}
          </div>
          <br />
          <div className="rowDivProfile">
            <h1 className="headerNormalText">
              Linked:{" "}
              {zProfile.partialView ? "Hidden" : zProfile.count_jobs_linkd}
            </h1>
            <h1 className="headerNormalText">
              Total: {zProfile.partialView ? "Hidden" : zProfile.count_jobs}
            </h1>
          </div>
          {editing ? (
            <Controller
              name="partialView"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  {...field}
                  defaultValue="true"
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Partial Profile"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Full Profile"
                  />
                </RadioGroup>
              )}
            />
          ) : zProfile.partialView ? (
            "Profile Hidden"
          ) : null}

          <br />
          <div className="profileButton">
            {editing ? (
              <>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </>
            ) : zProfile.user_id === zUser.id ? (
              <div className="profileButton">
                {" "}
                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : zUser.id === paramsId ? (
        // Profile does not exist, show form to create profile
        <div className="profileCard">
          <div className="profileAvatar">
            <Avatar
              alt={zUser.name}
              src={zUser.imageUrl}
              sx={{ width: 52, height: 52 }}
            />
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}
            >
              {zUser.name}
            </Typography>
          </div>
          <br />
          <Typography sx={{ fontSize: "16px" }}>{zUser.email}</Typography>
          <br />
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
                placeholder="Bio"
                margin="normal"
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Location"
                variant="outlined"
                fullWidth
                placeholder="Location"
                margin="normal"
              />
            )}
          />
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Website"
                variant="outlined"
                fullWidth
                placeholder="Website"
                margin="normal"
              />
            )}
          />
          <Controller
            name="github"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="GitHub"
                variant="outlined"
                fullWidth
                placeholder="GitHub"
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
                label="LinkedIn"
                variant="outlined"
                fullWidth
                placeholder="LinkedIn"
                margin="normal"
              />
            )}
          />
          <Controller
            name="partialView"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                {...field}
                defaultValue="true"
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Partial Profile"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Full Profile"
                />
              </RadioGroup>
            )}
          />
          <br />
          <div className="profileButton">
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              Create Profile
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      ) : (
        <div className="profileCard">
          <div className="profileAvatar">
            <Avatar
              alt={zGuestUser.name}
              src={zGuestUser.imageUrl}
              sx={{ width: 52, height: 52 }}
            />
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}
            >
              {zGuestUser.name}
            </Typography>
          </div>
          <h1 className="avatarTitle">{zGuestUser.email}</h1>
          <h1 className="avatarTitle">
            {zGuestUser.name} has not created a profile.
          </h1>
        </div>
      )}
    </div>
  );
};

export default Profile;
