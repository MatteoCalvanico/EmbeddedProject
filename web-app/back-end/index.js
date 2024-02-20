const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const hostname = "localhost";
const port = 7000;
const outputFile = "./mqtt-subscription/output.txt";

app.use(cors());

app.listen(port, hostname, () => {
  console.log("Server running at http://${hostname}:${port}/");
});

app.get("/", (req, res) => {
  fs.readFile(outputFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    const rows = data.split("\n");

    const stringJson = `{
      "items": [
        ${rows}
      ]
    }`;

    const response = JSON.parse(stringJson);

    res.send(response);
  });
});
