const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskAnalytics,
} = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} = require("../services/validators");

const router = express.Router();

router.use(authMiddleware);

router.get("/", validate(taskQuerySchema, "query"), getTasks);
router.get("/analytics", getTaskAnalytics);
router.post("/", validate(createTaskSchema), createTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
