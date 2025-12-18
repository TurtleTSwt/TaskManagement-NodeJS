require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const MySQLConnection = require('./infrastructure/database/MySQLConnection');
const ErrorHandler = require('./infrastructure/middleware/ErrorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
async function startServer() {
  try {

    // 1. Ket noi database
    await MySQLConnection.connect();
    const dbPool = MySQLConnection.getPool();

    let authContainer = null;
    let authMiddleware = null;
    let userRepository = null;
    let emailService = null;

    if (process.env.ENABLE_AUTH === 'true') {

      const AuthContainer = require('./infrastructure/config/AuthContainer');

      authContainer = new AuthContainer(dbPool);

      authMiddleware = authContainer.getAuthMiddleware();
      userRepository = authContainer.getUserRepository();
      emailService = authContainer.getEmailService();

      app.use('/api/auth', authContainer.getAuthRouter());

    } else {
      console.log('Auth DISABLED');
    }

    
    if (process.env.ENABLE_TASKS === 'true') {
      if (!authContainer) {
        console.error('❌ Task module requires Auth. Please ENABLE_AUTH=true');
        process.exit(1);
      }

      console.log('📦 Initializing Task Container...');
      const TaskContainer = require('./infrastructure/config/TaskContainer');

      const taskContainer = new TaskContainer(
        dbPool,
        authMiddleware,
        userRepository,
        emailService
      );

      app.use('/api/tasks', taskContainer.getTaskRouter());
      console.log('Task ENABLED');

    } else {
      console.log('Task DISABLED');
    }


    if (process.env.ENABLE_GROUPS === 'true') {
      if (!authContainer) {
        console.error('❌ Group module requires Auth. Please ENABLE_AUTH=true');
        process.exit(1);
      }

      console.log('📦 Initializing Group Container...');
      const GroupContainer = require('./infrastructure/config/GroupContainer');

      const groupContainer = new GroupContainer(
        dbPool,
        authMiddleware,
        userRepository,
        emailService
      );

      app.use('/api/groups', groupContainer.getGroupRouter());
      console.log('Group ENABLED');

    } else {
      console.log('Group DISABLED');
    }

    // ========================================
    // BASE ROUTE
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

    // 404 fallback
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Route not found' }
      });
    });

    app.use(ErrorHandler.handle);

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('------------- MODULE STATUS -------------');
      console.log(`🔐 Auth:   ${process.env.ENABLE_AUTH}`);
      console.log(`📌 Tasks:  ${process.env.ENABLE_TASKS}`);
      console.log(`📌 Groups: ${process.env.ENABLE_GROUPS}`);
      console.log('-----------------------------------------');
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
