module.exports = {
  firstName: {
    type: 'string',
    example: 'Arturo'
  },
  lastName: {
    type: 'string',
    example: 'Ramirez'
  },
  email: {
    type: 'string',
    example: 'arturo.ramirez@wolox.co'
  },
  password: {
    type: 'string',
    example: 'myPass1234'
  },
  User: {
    type: 'object',
    properties: {
      firstName: {
        $ref: '#/components/schemas/firstName'
      },
      lastName: {
        $ref: '#/components/schemas/lastName'
      },
      email: {
        $ref: '#/components/schemas/email'
      },
      password: {
        $ref: '#/components/schemas/password'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  }
};
