const { app } = require('@azure/functions');
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { initializeCosmosDb, getContainer } = require("../startup/cosmosDb");

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
        
        await initializeCosmosDb();
        const container = getContainer();
        const body = await request.json();

        // Validate request body.
        const { error } = schema.validate(body);
        if (error) {
          context.log("Validation error:", error.details[0].message);
          return {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.details[0].message }),
          };
        }
        
        const { email, password } = body;
  
        // Fetch the user from the database
       const querySpec = {
          query: `
            SELECT * 
            FROM c 
            WHERE c.type = 'user' AND c.email = @Email `,
          parameters: [{ name: "@Email", value: email }],
        };
        
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
