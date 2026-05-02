const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/jiit-smartsched', { useNewUrlParser: true, useUnifiedTopology: true });
  const TimetableVersion = require('./models/TimetableVersion');
  const indexes = await TimetableVersion.collection.getIndexes();
  console.log("Indexes on TimetableVersion:", indexes);
  process.exit();
}
check().catch(e => { console.error(e); process.exit(); });
