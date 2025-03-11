const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

const loadData = (file) => {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return {};
    }
};

const saveData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
};

const dataFile = "data.json";
const bansFile = "bans.json";

app.post("/v1/roblox/savedata", (req, res) => {
    const { USERID, PLACEID, CONTENT } = req.body;
    if (!USERID || !PLACEID || !CONTENT) return res.status(400).send("Missing fields");

    const data = loadData(dataFile);
    if (!data[PLACEID]) data[PLACEID] = {};
    data[PLACEID][USERID] = CONTENT;
    saveData(dataFile, data);

    res.send("Data saved");
});

app.post("/v1/roblox/loaddata", (req, res) => {
    const { USERID, PLACEID } = req.body;
    if (!USERID || !PLACEID) return res.status(400).send("Missing fields");

    const data = loadData(dataFile);
    res.json(data[PLACEID]?.[USERID] || "No data found");
});

app.post("/v1/roblox/savebans", (req, res) => {
    const { PLACEID, BANNEDLIST } = req.body;
    if (!PLACEID || !Array.isArray(BANNEDLIST)) return res.status(400).send("Invalid fields");

    const bans = loadData(bansFile);
    bans[PLACEID] = BANNEDLIST;
    saveData(bansFile, bans);

    res.send("Bans saved");
});

app.post("/v1/roblox/loadbans", (req, res) => {
    const { PLACEID } = req.body;
    if (!PLACEID) return res.status(400).send("Missing fields");

    const bans = loadData(bansFile);
    res.json(bans[PLACEID] || []);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
