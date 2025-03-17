const mongoose = require("mongoose");

// Define the Mongoose schema
const todoSchema = new mongoose.Schema({
  category: { type: String, required: true },
  hostname: { type: String, required: true },
  details: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      src: { type: String },
    },
  ],
  status: {
    type: String,
    enum: ["completed", "not completed"],
    required: true,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
