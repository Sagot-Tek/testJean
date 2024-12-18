const { app } = require('@azure/functions');
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const { initializeCosmosDb, getContainer } = require("../startup/cosmosDb");

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
});

app.http('auth-login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    //route: 'uth',
    handler: async (request, context) => {
      try {
        return {
          status: 200,

         body: JSON.stringify({ token }), // Ensure proper serialization
        };
      } catch (error) {
        context.log('Error validating user:');
        return {
          status: 500,

         body: JSON.stringify({ error: 'Internal Server Error' }), // Ensure proper serialization
        };
      }
    },
});
