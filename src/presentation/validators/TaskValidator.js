const Joi = require('joi');

class TaskValidator {
  // ================= CREATE TASK =================
  static create(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).required(),
      description: Joi.string().allow('').optional(),
      dueDate: Joi.date().iso().allow(null).optional(),
      // Cập nhật priority để khớp với DB (thêm urgent)
      priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
      // SỬA TẠI ĐÂY: Khớp hoàn toàn với ENUM Database
      status: Joi.string().valid('todo', 'in_progress', 'review', 'done', 'cancelled').default('todo'),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
  }

  // ================= UPDATE TASK =================
  static update(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).optional(),
      description: Joi.string().allow('').optional(),
      dueDate: Joi.date().iso().allow(null).optional(),
      priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
      // SỬA TẠI ĐÂY: Khớp hoàn toàn với ENUM Database
      status: Joi.string().valid('todo', 'in_progress', 'review', 'done', 'cancelled').optional(),
    }).min(1);

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
  }

  // ================= ASSIGN TASK =================
  static assign(req, res, next) {
    const schema = Joi.object({
      userId: Joi.number().integer().positive().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
  }

  // ================= UNASSIGN TASK =================
  static unassign(req, res, next) {
  const schema = Joi.object({
    taskId: Joi.number().integer().required(),
    userId: Joi.number().integer().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}

  // ================= DELETE TASK =================
static deleteTask(req, res, next) {
  const schema = Joi.object({
    taskId: Joi.number().integer().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}


  // ================= ADD COMMENT =================
  static addComment(req, res, next) {
    const schema = Joi.object({
      content: Joi.string().min(1).max(2000).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
  }

  // ================= GET COMMENTS =================
  static getComments(req, res, next) {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    });

    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
  }
}

module.exports = TaskValidator;
