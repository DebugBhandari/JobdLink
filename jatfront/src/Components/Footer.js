import Link from "@mui/material/Link";
import InputBase from "@mui/material/InputBase"; // Add this line to import the 'useStyles' function
import logo from "../assets/JobdLanding.png";
import "./index.css";

export default function Footer() {
  return (
    <div className="footDiv">
      <div className="footTitle">
        <div className="footTitleDiv">
          {" "}
          <div className="imageFooterDiv">
            {" "}
            <img src={logo} alt="logo" className="footImage" />
          </div>{" "}
          <div className="footTitleText">For Jobseekers. By Jobseekers.</div>
        </div>
        <div className="footTitleDiv">
          <div className="footRightSideDiv">
            <div className="footRightSideText">
              copyright
              <a href="https://debugbhandari.link">"@debugbhandari.link</a>
            </div>
            <div className="footRightSideText">Job Application Tracker</div>
          </div>
        </div>
      </div>
    </div>
  );
}
