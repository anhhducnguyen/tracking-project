const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Đường dẫn file
const EVENTS_FILE = path.join(__dirname, "events.json");

// Hàm ghi vào file
function saveEventToFile(event) {
  let data = [];

  // Nếu file tồn tại → đọc
  if (fs.existsSync(EVENTS_FILE)) {
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    try {
      data = JSON.parse(raw);
    } catch {
      data = [];
    }
  }

  // Thêm event
  data.push(event);

  // Ghi lại file
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2), "utf8");
}

// API nhận event
app.post("/track", (req, res) => {
  const event = {
    userId: req.body.userId || null,
    eventType: req.body.eventType,
    pageUrl: req.body.pageUrl,
    element: req.body.element || null,
    metadata: req.body.metadata || {},
    duration: req.body.duration || null,
    createdAt: new Date().toISOString(),
  };

  saveEventToFile(event);

  res.json({ ok: true });
});

app.listen(4000, () => console.log("Backend running on port 4000"));
