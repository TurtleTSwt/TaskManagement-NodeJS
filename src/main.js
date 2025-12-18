require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const MySQLConnection = require('./infrastructure/database/MySQLConnection');
const ErrorHandler = require('./infrastructure/middleware/ErrorHandler');

const TaskContainer = require('./infrastructure/config/TaskContainer');

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== START SERVER ==================
async function startServer() {
  try {
    // 1. Connect database
    await MySQLConnection.connect();
    const dbPool = MySQLConnection.getPool();

    let authMiddleware = null;
    let userRepository = null;
    let emailService = null;

    // ================== AUTH ==================
    if (process.env.ENABLE_AUTH === 'true') {
      const AuthContainer = require('./infrastructure/config/AuthContainer');

      const authContainer = new AuthContainer(dbPool);

      authMiddleware = authContainer.getAuthMiddleware();
      userRepository = authContainer.getUserRepository();
      emailService = authContainer.getEmailService();

      app.use('/api/auth', authContainer.getAuthRouter());
      console.log('Auth ENABLED');
    } else {
      console.log('Auth DISABLED');

      // ===== FAKE AUTH =====
      authMiddleware = (req, res, next) => {
        req.user = { id: 1 };
        next();
      };

      userRepository = {
        async findById(id) {
          return {
            id: Number(id),
            full_name: 'Test User',
            email: 'test@example.com',
            avatar_url: null
          };
        }
      };

      emailService = {
        async sendEmail(to, subject) {
          console.log(`[FAKE EMAIL] To: ${to}, Subject: ${subject}`);
        }
      };
    }

    // ================== TASK ==================
    if (process.env.ENABLE_TASKS === 'true') {
      console.log('📦 Initializing Task Container...');

      const taskContainer = new TaskContainer(
        dbPool,
        authMiddleware,
        userRepository,
        emailService
      );

      app.use('/api/tasks', taskContainer.getRouter());
    }

    // ================== BASE ROUTE ==================
    app.get('/', (req, res) => {
      res.json({
        system: 'Task Management API',
        modules: {
          auth: process.env.ENABLE_AUTH === 'true',
          tasks: process.env.ENABLE_TASKS === 'true',
          groups: process.env.ENABLE_GROUPS === 'true'
        }
      });
    });

    // 404
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Route not found' }
      });
    });

    app.use(ErrorHandler.handle);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
