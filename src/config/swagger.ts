const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Finance Data Processing and Access Control API',
    version: '1.0.0',
    description:
      'API documentation for finance dashboard backend with users, records, access control, and dashboard summaries.'
  },
  servers: [
    {
      url: '/'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Records', description: 'Financial record endpoints' },
    { name: 'Dashboard', description: 'Dashboard summary endpoints' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Charan1' },
          email: { type: 'string', example: 'charan1@test.com' },
          password: { type: 'string', example: '123456781' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'charan@test.com' },
          password: { type: 'string', example: '12345678' }
        }
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'Finance Admin' },
          email: { type: 'string', example: 'admin@finance.local' },
          password: { type: 'string', example: 'Admin@123' },
          role: {
            type: 'string',
            enum: ['VIEWER', 'ANALYST', 'ADMIN'],
            example: 'ADMIN'
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
            example: 'ACTIVE'
          }
        }
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Updated Name' },
          email: { type: 'string', example: 'updated@test.com' },
          role: {
            type: 'string',
            enum: ['VIEWER', 'ANALYST', 'ADMIN'],
            example: 'ANALYST'
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
            example: 'ACTIVE'
          }
        }
      },
      UpdateUserStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
            example: 'INACTIVE'
          }
        }
      },
      CreateRecordRequest: {
        type: 'object',
        required: ['amount', 'type', 'category', 'date'],
        properties: {
          amount: { type: 'number', example: 5000 },
          type: {
            type: 'string',
            enum: ['INCOME', 'EXPENSE'],
            example: 'INCOME'
          },
          category: { type: 'string', example: 'Salary' },
          date: { type: 'string', example: '2026-04-05' },
          note: { type: 'string', example: 'Monthly salary' }
        }
      },
      UpdateRecordRequest: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 7000 },
          type: {
            type: 'string',
            enum: ['INCOME', 'EXPENSE'],
            example: 'EXPENSE'
          },
          category: { type: 'string', example: 'Food' },
          date: { type: 'string', example: '2026-04-05' },
          note: { type: 'string', example: 'Updated note' }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation failed' },
          409: { description: 'Email already exists' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          400: { description: 'Validation failed' },
          401: { description: 'Invalid credentials' },
          403: { description: 'Account is inactive' },
          404: { description: 'User not found' }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Users fetched successfully' },
          403: { description: 'Forbidden' },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' }
            }
          }
        },
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Validation failed' },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'User fetched successfully' },
          404: { description: 'User not found' }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Update a user',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' }
            }
          }
        },
        responses: {
          200: { description: 'User updated successfully' },
          400: { description: 'Validation failed' },
          404: { description: 'User not found' }
        }
      }
    },
    '/api/users/{id}/status': {
      patch: {
        tags: ['Users'],
        summary: 'Update user status',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserStatusRequest' }
            }
          }
        },
        responses: {
          200: { description: 'User status updated successfully' },
          404: { description: 'User not found' }
        }
      }
    },
    '/api/records': {
      get: {
        tags: ['Records'],
        summary: 'Get records with filters and pagination',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Records fetched successfully' },
          403: { description: 'Forbidden' }
        }
      },
      post: {
        tags: ['Records'],
        summary: 'Create a financial record',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRecordRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Record created successfully' },
          400: { description: 'Validation failed' },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/api/records/{id}': {
      get: {
        tags: ['Records'],
        summary: 'Get record by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Record fetched successfully' },
          404: { description: 'Record not found' }
        }
      },
      patch: {
        tags: ['Records'],
        summary: 'Update a financial record',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateRecordRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Record updated successfully' },
          404: { description: 'Record not found' }
        }
      },
      delete: {
        tags: ['Records'],
        summary: 'Soft delete a financial record',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Record deleted successfully' },
          404: { description: 'Record not found' }
        }
      }
    },
    '/api/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get summary dashboard data',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard summary fetched successfully' }
        }
      }
    },
    '/api/dashboard/recent-activity': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get recent activity',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Recent activity fetched successfully' }
        }
      }
    },
    '/api/dashboard/category-totals': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get category-wise totals',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Category totals fetched successfully' }
        }
      }
    },
    '/api/dashboard/monthly-trend': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get monthly trend data',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Monthly trend fetched successfully' }
        }
      }
    }
  }
};

export default swaggerSpec;