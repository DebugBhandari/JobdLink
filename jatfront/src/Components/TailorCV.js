import React, { useState } from "react";
import useJLStore from "../useStore";
import Button from "@mui/material/Button";
import { baseUrl } from "../App";

const TailorCV = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredCV, setTailoredCV] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = useJLStore((state) => state.zUser.id);

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const tailorCV = async () => {
    setTailoredCV(""); // Clear previous CV
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/tailor-cv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, jobDescription }),
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let result = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          setTailoredCV(result); // Update state with the current result
        }
      } else {
        const errorJson = await response.json();
        console.error("Error tailoring CV:", errorJson);
        alert(errorJson.error);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "60px auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Tailor CV for Job Description
      </h3>

      <textarea
        value={jobDescription}
        onChange={handleJobDescriptionChange}
        rows="15"
        cols="50"
        placeholder="Paste job description here..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />

      <Button
        onClick={tailorCV}
        disabled={loading}
        sx={{
          marginTop: "20px",
          fontSize: "14px",
          fontWeight: "bold",
          backgroundColor: "#2a2e45",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "white",
            color: "#2a2e45",
          },
        }}
      >
        {loading ? "Tailoring CV..." : "Tailor CV"}
      </Button>

      <div
        id="output"
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
          minHeight: "30dvh",
        }}
      >
        {tailoredCV ||
          (loading
            ? "Generating tailored CV..."
            : "Upload a CV in your profile. Your tailored CV will appear here.")}
      </div>
    </div>
  );
};

export default TailorCV;
