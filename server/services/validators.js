const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter and one number.",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().allow("").max(2000).default(""),
  status: Joi.string().valid("Todo", "In Progress", "Done").default("Todo"),
  priority: Joi.string().valid("Low", "Medium", "High").default("Medium"),
  dueDate: Joi.date().iso().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  description: Joi.string().allow("").max(2000),
  status: Joi.string().valid("Todo", "In Progress", "Done"),
  priority: Joi.string().valid("Low", "Medium", "High"),
  dueDate: Joi.date().iso().allow(null),
}).min(1);

const taskQuerySchema = Joi.object({
  status: Joi.string().valid("Todo", "In Progress", "Done"),
  priority: Joi.string().valid("Low", "Medium", "High"),
  search: Joi.string().trim().allow(""),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string()
    .valid("createdAt", "dueDate", "priority")
    .default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
});

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
};
