const express = require("express");
const cors = require("cors");              // ← ADD THIS
const { exec } = require("child_process");

const app = express();

app.use(cors());                            // ← ADD THIS (VERY IMPORTANT)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Public IP Scanner API running");
});

app.post("/scan", (req, res) => {
  const { targets, ports } = req.body;

  // Basic validation
  if (!targets || !Array.isArray(targets)) {
    return res.status(400).json({ error: "Targets must be an array" });
  }

  if (targets.length === 0 || targets.length > 16) {
    return res.status(400).json({ error: "Max 16 IPs per scan" });
  }

  const portList = ports || "21,22,80,443,8080";

  const command = `nmap -sT -Pn -T4 -p ${portList} --open ${targets.join(" ")}`;

  exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Scan failed" });
    }

    res.json({
      scanned: targets,
      ports: portList,
      result: stdout
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
