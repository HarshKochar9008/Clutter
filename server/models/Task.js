const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1, priority: 1, dueDate: 1, createdAt: -1 });
taskSchema.index({ user: 1, title: "text" });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
