const Task = require("../models/Task");
const asyncHandler = require("../middlewares/asyncHandler");

const buildSort = (sortBy, order) => {
  const direction = order === "asc" ? 1 : -1;
  if (sortBy === "priority") {
    return { priority: direction, createdAt: -1 };
  }
  return { [sortBy]: direction, createdAt: -1 };
};

const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, page, limit, sortBy, order } = req.query;
  const filter = { user: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.$text = { $search: search };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(buildSort(sortBy, order))
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  res.json({ success: true, data: task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  res.json({ success: true, message: "Task deleted successfully." });
});

const getTaskAnalytics = asyncHandler(async (req, res) => {
  const total = await Task.countDocuments({ user: req.user._id });
  const completed = await Task.countDocuments({ user: req.user._id, status: "Done" });
  const pending = await Task.countDocuments({
    user: req.user._id,
    status: { $ne: "Done" },
  });

  res.json({
    success: true,
    data: {
      total,
      completed,
      pending,
      completionRate: total ? Number(((completed / total) * 100).toFixed(1)) : 0,
    },
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskAnalytics,
};
