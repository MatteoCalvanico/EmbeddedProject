import React from "react";

const EspActions = ({ espId }) => {
  const url = "http://localhost:7000/set-esp-status";

  async function sendPostRequest(data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error sending POST request: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error sending POST request:", error);
      throw error;
    }
  }

  const handleClick = (enable) => {
    const reqBody = {
      ESPname: espId,
      status: "",
    };

    if (enable) {
      reqBody.status = "enabled";
      sendPostRequest(reqBody);
    } else {
      reqBody.status = "disable";
      sendPostRequest(reqBody);
    }
  };

  return (
    <div className="inline-container">
      <button className="green-button" onClick={() => handleClick(true)}>
        Enable
      </button>
      <button className="red-button " onClick={() => handleClick(false)}>
        Disable
      </button>
    </div>
  );
};

export default EspActions;
