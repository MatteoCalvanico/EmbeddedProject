const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const app = express();

const hostname = "localhost";
const port = 7000;
const outputFile = "./mqtt-subscription/output.txt";

app.use(bodyParser.json());
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

app.post("/set-esp-status", async (req, res) => {
  try {
    const { status, ESPname } = req.body;

    if (!status) {
      throw new Error("Filename is required.");
    }

    const command =
      "sh ./mqtt-subscription/publisher.sh " + status + "-" + ESPname;

    if (status === "disable") {
      console.log("ok 1");
      //
    } else if (status === "enabled") {
      console.log("ok 2");
      //
    } else {
      res.status(200).send('status property must be "disable" or "enabled"');
      return;
    }

    await exec(command); //TODO move

    res.status(200).send(`File ${status}.txt created successfully.`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating file.");
  }
});
