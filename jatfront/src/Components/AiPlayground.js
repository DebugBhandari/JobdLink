import React, { useState, useEffect, useRef } from "react";
import useJLStore from "../useStore";
import Button from "@mui/material/Button";
import UserAvatar from "./UserAvatar";
import { baseUrl } from "../App";
import llama from "../assets/llama.png";

const AiPlayground = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const zUser = useJLStore((state) => state.zUser);
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: zUser.name, text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      const botMessage = { sender: "bot", text: [] }; // Initialize text as an array
      let botIndex;
      setMessages((prevMessages) => {
        botIndex = prevMessages.length;
        return [...prevMessages, botMessage];
      });

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          const paragraphs = result.split("\n\n"); // Split text into paragraphs
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[botIndex] = { ...botMessage, text: paragraphs };
            return updatedMessages;
          });
        }
      } catch (streamError) {
        console.error("Error during stream:", streamError);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[botIndex] = {
            ...botMessage,
            text: ["An error occurred while receiving the response."],
          };
          return updatedMessages;
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setLoading(false);
    }
  };

  const chatboxRef = useRef(null);
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{
        width: "80%",
        marginTop: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "60px",
      }}
    >
      <h3>Llama3.2 Playground.</h3>
      <div
        ref={chatboxRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "50vh",
          border: "1px solid #2a2e45",
          borderRadius: 10,
          width: "100%",
          padding: "20px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: msg.sender === "bot" ? "flex-end" : "flex-start",
              width: "100%",
              padding: "10px 0",
            }}
          >
            {msg.sender !== "bot" && <UserAvatar imageUrl={zUser.imageUrl} />}
            <p
              style={{
                margin: "0 10px",
                backgroundColor: msg.sender === "bot" ? "#e0e0e0" : "#d1e7dd",
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </p>
            {msg.sender === "bot" && <UserAvatar imageUrl={llama} />}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        style={{
          width: "100%",
          minHeight: "40px",
          marginTop: "20px",
          borderRadius: 10,
          padding: "10px",
        }}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <Button
        onClick={handleSend}
        disabled={loading}
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
          marginTop: "20px",
          marginBottom: "100px",
          "&:hover": {
            backgroundColor: "white",
            color: "#2a2e45",
          },
        }}
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
};

export default AiPlayground;
