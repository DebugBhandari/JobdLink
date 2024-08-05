import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useJLStore from "../useStore";
import { baseUrl } from "../App";
import { useLocation } from "react-router-dom";
import { useForm, Controller, set } from "react-hook-form";
import TextField from "@mui/material/TextField";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LanguageIcon from "@mui/icons-material/Language";
import "./index.css";
import Link from "@mui/material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
const Profile = ({ partialToggle, setPartialToggle }) => {
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
  const toggleProfilePartial = useJLStore(
    (state) => state.toggleProfilePartial
  );

  const locationPath = useLocation();
  const paramsId = parseInt(locationPath.pathname.split("/")[2]);

  const setProfilePartial = async (user_id) => {
    try {
      const response = await axios.put(`${baseUrl}/profile/toggle/${user_id}`);
      setZProfile(response.data);
      setPartialToggle((prev) => !prev);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    setZProfile(paramsId);
    setZGuestProfile(paramsId);
  }, [paramsId, setZProfile, setZGuestProfile, partialToggle]);

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
  }, [reset]);

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
      setZProfile(paramsId);
    }
  };

  return (
    <div className="profileMainDiv">
      <div className="profileCard">
        <div className="profileAvatar">
          <div className="profileAvatarCard">
            <Avatar
              alt={zGuestProfile?.name}
              src={zGuestProfile?.imageUrl}
              sx={{
                width: { xs: 60, md: 80, lg: 100 },
                height: { xs: 60, md: 80, lg: 100 },
              }}
            />
            <div className="profileAvatarDiv">
              <Typography
                sx={{ fontSize: "18px", fontWeight: "bold", padding: 0 }}
              >
                {zGuestProfile?.name}
              </Typography>
              <p className="profileAvatarTitle">{zGuestProfile?.email}</p>

              <p className="profileAvatarLocation">
                <LocationOnIcon sx={{ marginTop: "4px" }} />
                {zGuestProfile?.location}
              </p>

              {zGuestProfile.count_jobs ? (
                <div className="profileLinks">
                  <Typography
                    sx={{
                      fontSize: "16px",
                      display: "flex",
                      padding: "6px",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: "20%",
                      color: "black",
                      margin: "0 2px",
                    }}
                  >
                    {zGuestProfile.partialView ? (
                      <GitHubIcon sx={{ opacity: 0.2 }} />
                    ) : (
                      <a
                        href={zProfile?.github}
                        rel="noreferrer"
                        className="profileLinkIcon"
                        target="_blank"
                      >
                        <GitHubIcon />
                      </a>
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      display: "flex",
                      padding: "6px",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: "20%",
                      color: "black",
                      margin: "0 2px",
                    }}
                  >
                    {zGuestProfile.partialView ? (
                      <LinkedInIcon sx={{ opacity: 0.2 }} />
                    ) : (
                      <a
                        href={zProfile?.linkedin}
                        rel="noreferrer"
                        className="profileLinkIcon"
                        target="_blank"
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      display: "flex",
                      padding: "6px",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: "20%",
                      color: "black",
                      margin: "0 2px",
                    }}
                  >
                    {zGuestProfile.partialView ? (
                      <LanguageIcon sx={{ opacity: 0.2 }} />
                    ) : (
                      <a
                        href={zGuestProfile?.website}
                        rel="noreferrer"
                        className="profileLinkIcon"
                        target="_blank"
                      >
                        {" "}
                        <LanguageIcon />
                      </a>
                    )}
                  </Typography>
                </div>
              ) : (
                <div>{zGuestProfile.name} has not created a profile.</div>
              )}
            </div>
          </div>
          {zUser?.id === paramsId ? (
            <div className="profileButton">
              {/* <Button
                  onClick={() => setEditing(true)}
                  sx={{
                    backgroundColor: "#2a2e45",
                    color: "white",
                    fontWeight: "bold",
                    marginTop: 1,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#757681" },
                  }}
                > */}
              <Button
                onClick={() => {
                  window.location.href = `/editProfile/${zUser.id}`;
                }}
                sx={{
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: "bolder",
                  backgroundColor: "#2a2e45",
                  width: "160px",
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
                Edit Profile
              </Button>
              {zGuestProfile.partialView !== null ? (
                <Button
                  onClick={() => setProfilePartial(zGuestProfile.id)}
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
                  {zProfile?.partialView ? "Partial" : "FullView"}
                </Button>
              ) : null}

              {/* </Button> */}
            </div>
          ) : null}
        </div>
        <div className="profileContentDiv">
          <div className="profileCentreText">
            <p className="headerGreyText">{zGuestProfile?.bio}</p>
          </div>
          <div className="rowDivProfile">
            <h1 className="headerNormalText">
              Linked Jobs:{" "}
              {zGuestProfile?.partialView
                ? "Hidden"
                : zGuestProfile?.count_jobs_linkd}
            </h1>
            <h1 className="headerNormalText">
              Applied Jobs:{" "}
              {zGuestProfile?.partialView
                ? "Hidden"
                : zGuestProfile?.count_jobs}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
