import "./App.css";
import React, { useEffect } from "react";
import data from "./subscriber/output.csv";

function App() {
  useEffect(() => {
    fetch("./subscriber/output.csv")
      .then((response) => response.text())
      .then((text) => {
        // Split the text by line breaks to get individual rows
        const rows = text.split("\n");

        // Skip the first row if it contains headers
        rows.shift();

        // Process each row, assuming it's comma-separated
        rows.forEach((row) => {
          const values = row.split(",");
          // Process the values here, e.g., log them to the console
          console.log(values);
        });
      })
      .catch((error) => {
        console.error("Error fetching or parsing CSV:", error);
      });
  }, []);
  return <div className="App"></div>;
}

export default App;
