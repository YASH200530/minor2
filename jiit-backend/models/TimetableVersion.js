const mongoose = require("mongoose");

const TimetableVersionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  entries: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  clashes: {
    type: Array,
    default: []
  },
  orderedDays: {
    type: [String],
    default: []
  },
  orderedTimes: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("TimetableVersion", TimetableVersionSchema);
