const { app } = require('@azure/functions');

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
