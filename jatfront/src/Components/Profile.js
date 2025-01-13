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
import UserAvatar from "./UserAvatar";
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
  const activeProfile = useJLStore((state) => state.activeProfile);
  const setActiveProfile = useJLStore((state) => state.setActiveProfile);
  // const zGuestProfile = useJLStore((state) => state.zGuestProfile);
  // const setZGuestProfile = useJLStore((state) => state.setZGuestProfile);
  const userId = activeProfile?.user_id;

  const [cvUrl, setCvUrl] = useState("");
  const [cvFileName, setCvFileName] = useState("");

  const toggleProfilePartial = useJLStore(
    (state) => state.toggleProfilePartial
  );

  const locationPath = useLocation();
  const paramsId = parseInt(locationPath.pathname.split("/")[2]);

  const setProfilePartial = async (user_id) => {
    try {
      const response = await fetch(`${baseUrl}/profile/toggle/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${zUser.token}`,
        },
      });

      setActiveProfile(response.data);
      setPartialToggle((prev) => !prev);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    setActiveProfile(paramsId);
    if (activeProfile) {
      reset({
        bio: activeProfile.bio || "",
        location: activeProfile.location || "",
        website: activeProfile.website || "",
        github: activeProfile.github || "",
        linkedin: activeProfile.linkedin || "",
        partialView: activeProfile.partialView ? true : false,
      });
    }
  }, [reset, paramsId, setActiveProfile, partialToggle]);

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
        },
        body: JSON.stringify({
          ...data,
          user_id: parseInt(zUser.id),
        }),
      });

      setActiveProfile(paramsId); // Refresh profile data
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
        partialView: activeProfile.partialView ? "true" : "false",
      });
      setActiveProfile(paramsId);
    }
  };

  useEffect(() => {
    // Fetch the user's CV on component load
    const fetchCv = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/cv/${userId}`);
        setCvUrl(response.data.url);
        setCvFileName(response.data.fileName);
      } catch (error) {
        console.error("Error fetching CV:", error.response.data.error);
      }
    };

    fetchCv();
  }, [userId]);
  // Upload CV
  const uploadCv = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("cv", file);
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        "http://localhost:3001/cv/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${zUser.token}`, // Move Authorization here
          },
        }
      );
      setCvUrl(response.data.url);
      setCvFileName(response.data.fileName);
      alert("CV uploaded successfully!");
    } catch (error) {
      console.error("Error uploading CV:", error);
    }
  };

  // Delete CV
  const deleteCv = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this CV?"
      );
      if (!confirmDelete) return;
      await axios.delete(`http://localhost:3001/cv/${userId}`, {
        headers: {
          Authorization: `Bearer ${zUser.token}`,
        },
      });

      setCvUrl("");
      setCvFileName("");
      alert("CV deleted successfully!");
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  return (
    <div className="profileMainDiv">
      <div className="profileCard">
        <div className="profileAvatar">
          <div className="profileAvatarCard">
            <UserAvatar
              name={activeProfile?.name}
              imageUrl={activeProfile?.imageUrl}
              profileAvatar={1}
            />
            <div className="profileAvatarDiv">
              <Typography
                sx={{ fontSize: "18px", fontWeight: "bold", padding: 0 }}
              >
                {activeProfile?.name}
              </Typography>
              <p className="profileAvatarTitle">{activeProfile?.email}</p>

              <p className="profileAvatarLocation">
                <LocationOnIcon sx={{ marginTop: "4px" }} />
                {activeProfile?.location}
              </p>

              {activeProfile?.count_jobs ? (
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
                    {activeProfile?.partialView || !activeProfile?.github ? (
                      <GitHubIcon sx={{ opacity: 0.2 }} />
                    ) : (
                      <a
                        href={activeProfile?.github}
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
                    {activeProfile.partialView || !activeProfile.linkedin ? (
                      <LinkedInIcon sx={{ opacity: 0.2 }} />
                    ) : (
                      <a
                        href={activeProfile?.linkedin}
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
                    {activeProfile.partialView || !activeProfile.website ? (
                      <LanguageIcon sx={{ opacity: 0.2 }} />
                    ) : (
                      <a
                        href={activeProfile?.website}
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
                <div>{activeProfile?.name} has not created a profile.</div>
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
                  width: "140px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  padding: "6px",
                  color: "white",
                  margin: "10px 0",
                  "&:hover": {
                    backgroundColor: "grey",
                    color: "#2a2e45",
                  },
                }}
              >
                Edit
              </Button>{" "}
              <label htmlFor="cv" className="uploadCv">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={uploadCv}
                  id="cv"
                  style={{ marginBottom: "20px" }}
                />
                {cvFileName ? "Update" : "Upload"} CV
              </label>
              {activeProfile?.partialView !== null ? (
                <Button
                  onClick={() => setProfilePartial(activeProfile.user_id)}
                  sx={{
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: "bolder",
                    backgroundColor: "#2a2e45",
                    width: "140px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    padding: "6px",
                    color: "white",
                    margin: "10px 0",
                    "&:hover": {
                      backgroundColor: "grey",
                      color: "#2a2e45",
                    },
                  }}
                >
                  {activeProfile?.partialView ? "Partial" : "FullView"}
                </Button>
              ) : null}
              {/* </Button> */}
            </div>
          ) : null}
        </div>
        <div className="profileContentDiv">
          <div className="profileCentreText">
            <p className="headerGreyText">{activeProfile?.bio}</p>
          </div>
          <div className="rowDivProfile">
            <h1 className="headerNormalText">
              Linked Jobs:{" "}
              {activeProfile?.partialView
                ? "Hidden"
                : activeProfile?.count_jobs_linkd}
            </h1>
            <h1 className="headerNormalText">
              Applied Jobs:{" "}
              {activeProfile?.partialView
                ? "Hidden"
                : activeProfile?.count_jobs}
            </h1>
          </div>
        </div>
      </div>
      {/* Upload CV */}

      {/* View and Delete CV */}
      {cvUrl && (
        <div className="resumeRow">
          <div className="resumeButton" title={cvFileName}>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </div>
          {zUser?.id === activeProfile?.user_id ? (
            <p className="deleteResume" onClick={deleteCv}>
              X
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Profile;
