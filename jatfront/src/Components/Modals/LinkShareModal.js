import React, { useState } from "react";
import Modal from "react-modal";
import "../index.css";
import { shareOnLinkedIn } from "../../utils/LinkedinApi";

import LinkedInIcon from "@mui/icons-material/LinkedIn";

const LinkShareModal = ({
  isOpen,
  onClose,

  imageUrl,
  linkedinId,
  token,
  jobId,
}) => {
  const [postComment, setPostComment] = useState("");
  const shareFromModal = async () => {
    await shareOnLinkedIn(imageUrl, linkedinId, token, jobId, postComment);
    console.log("shared");
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Screenshot Modal"
      className="shareModal"
      overlayClassName="overlay"
      // style={{
      //   overlay: {
      //     backgroundColor: "rgba(0, 0, 0, 0.6)",
      //   },
      //   content: {
      //     display: "flex",

      //     alignItems: "center",
      //     flexDirection: "column",
      //     top: "50%",
      //     left: "50%",
      //     right: "auto",
      //     bottom: "auto",
      //     marginRight: "-50%",
      //     transform: "translate(-50%, -50%)",
      //     opacity: 1,
      //     zIndex: 100,
      //     height: "70vh",
      //     width: "60vw",
      //     borderRadius: "10px",
      //   },

      // }}
    >
      <h2 className="shareTitle">
        Share Job to
        <span className="shareSpan">
          Linkedin <LinkedInIcon />
        </span>
      </h2>

      <div className="linkViewCard">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Screenshot"
            style={{ width: "100%", opacity: 1 }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <textarea
        className="captionInput"
        value={postComment}
        onChange={(e) => setPostComment(e.target.value)}
        placeholder="Add a caption for Linkedin..."
      />
      <div className="shareButtons">
        <button className="shareButton" onClick={onClose}>
          Cancel
        </button>
        <button className="shareButton" onClick={shareFromModal}>
          Share to
          <span className="shareSpan">
            Linkedin <LinkedInIcon />
          </span>
        </button>
      </div>
    </Modal>
  );
};

export default LinkShareModal;
