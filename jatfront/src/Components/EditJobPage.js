import react from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../App";

export const EditJobPage = () => {
  const { id } = useParams();

  const [job, setJob] = useState({});

  useEffect(() => {
    const fetchJobById = async (id) => {
      try {
        const response = await axios.get(`${baseUrl}/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    fetchJobById(id);
  }, []);
  console.log("job", job);
  return (
    <div className="editPage">
      <h1>Edit Job</h1>
      <form className="editpageForm">
        <label>Job Title</label>
        <input type="text" value={job.jobTitle} />
        <label>Company</label>
        <input type="text" value={job.company} />
        <label>Location</label>
        <input type="text" value={job.location} />
        <label>Caption</label>
        <input type="text" value={job.caption} />
        <label>Job Description</label>
        <textarea value={job.description} />
        <label>Job URL</label>
        <input type="text" value={job.jobUrl} />
        <label>Status</label>
        <input type="text" value={job.status} />
        <label>View</label>
        <label>Private</label>
        <input
          type="radio"
          value={1}
          name="private"
          checked={job.private === 1 ? "checked" : null}
        />
        <label>Public</label>
        <input
          type="radio"
          value={0}
          name="private"
          checked={job.private === 0 ? "checked" : null}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};
