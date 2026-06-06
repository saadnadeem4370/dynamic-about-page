const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static("public"));

const dataFile = path.join(__dirname, "data", "team.json");

// Read Team Members
function getTeamMembers() {
  const data = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(data);
}

// Save Team Members
function saveTeamMembers(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// GET ALL MEMBERS
app.get("/api/team", (req, res) => {
  const members = getTeamMembers();
  res.json(members);
});

// ADD MEMBER
app.post("/api/team", (req, res) => {
  const members = getTeamMembers();

  const newMember = {
    id: Date.now(),
    name: req.body.name,
    role: req.body.role,
    image: req.body.image,
    bio: req.body.bio,
    linkedin: req.body.linkedin,
    github: req.body.github
  };

  members.push(newMember);

  saveTeamMembers(members);

  res.status(201).json(newMember);
});

// UPDATE MEMBER
app.put("/api/team/:id", (req, res) => {
  const id = Number(req.params.id);

  const members = getTeamMembers();

  const index = members.findIndex(
    member => member.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Member not found"
    });
  }

  members[index] = {
    ...members[index],
    ...req.body
  };

  saveTeamMembers(members);

  res.json(members[index]);
});

// DELETE MEMBER
app.delete("/api/team/:id", (req, res) => {
  const id = Number(req.params.id);

  let members = getTeamMembers();

  const memberExists = members.some(
    member => member.id === id
  );

  if (!memberExists) {
    return res.status(404).json({
      message: "Member not found"
    });
  }

  members = members.filter(
    member => member.id !== id
  );

  saveTeamMembers(members);

  res.json({
    message: "Member deleted successfully"
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});