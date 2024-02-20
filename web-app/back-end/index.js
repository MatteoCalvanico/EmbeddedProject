const express = require("express");
const fs = require("fs");
const cors = require("cors");
const streamParser = require("stream-parser");

const app = express();
const hostname = "localhost";
const port = 7000;
const outputFile = "./mqtt-subscription/output.txt";

app.use(cors());

app.listen(port, hostname, () => {
  console.log(` Server running at http://${hostname}:${port}/`);
});

app.get("/", (req, res) => {
  fs.readFile(outputFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    const rows = data.split("\n");

    const lastElements = rows.slice(-5);

    const stringJson = `{"items": [${lastElements}]}`;

    const response = stringJson.slice(0, stringJson.length - 3) + "]}";

    let responseJson = {};
    try {
      responseJson = JSON.parse(response);
    } catch (error) {
      console.log(error);
    }
    console.log("response: " + JSON.stringify(responseJson));
    res.send(responseJson);
  });
});
