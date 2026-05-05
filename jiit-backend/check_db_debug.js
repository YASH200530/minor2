const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/jiit-smartsched');
  const TimetableVersion = require('./models/TimetableVersion');
  const latest = await TimetableVersion.findOne().sort({ createdAt: -1 });
  if (!latest) {
    console.log("No timetable versions found.");
  } else {
    console.log("Title:", latest.title);
    console.log("Status:", latest.status);
    console.log("Sample Entry:", JSON.stringify(latest.entries[0], null, 2));
    const uniqueDays = [...new Set(latest.entries.map(e => e.day))];
    const uniqueTimes = [...new Set(latest.entries.map(e => e.time))];
    const uniqueBatches = [...new Set(latest.entries.flatMap(e => e.batches))];
    console.log("Unique Days:", uniqueDays);
    console.log("Unique Times:", uniqueTimes);
    console.log("Unique Batches:", uniqueBatches);
  }
  process.exit();
}
check().catch(e => { console.error(e); process.exit(); });
