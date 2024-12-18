const { CosmosClient } = require('@azure/cosmos');
const { DefaultAzureCredential } = require('@azure/identity');
require('dotenv').config(); // Load .env for local development
const config = require('config');

// Dynamically prioritize environment variables or config/default.json
const cosmosDbConfig = {
  endpoint: process.env.COSMOS_DB_ENDPOINT || config.get('cosmosDb.endpoint'),
  key: process.env.COSMOS_DB_KEY || config.get('cosmosDb.key'),
  databaseId: process.env.COSMOS_DB_DATABASE_ID || config.get('cosmosDb.databaseId'),
  containerId: process.env.COSMOS_DB_CONTAINER_ID || config.get('cosmosDb.containerId'),
};

// Initialize CosmosClient
let client, database, container;

async function initializeCosmosDb() {
  if (client && database && container) return; // Already initialized

  try {
    if (process.env.WEBSITE_INSTANCE_ID) {
      // Use Managed Identity in Azure
      console.log('Using Azure Managed Identity for Cosmos DB...');
      const credential = new DefaultAzureCredential();
      client = new CosmosClient({
        endpoint: cosmosDbConfig.endpoint,
        aadCredentials: credential,
      });
    } else {
      // Use Cosmos DB key for local development
      console.log('Using Cosmos DB key for local development...');
      client = new CosmosClient({
        endpoint: cosmosDbConfig.endpoint,
        key: cosmosDbConfig.key,
      });
    }

    database = client.database(cosmosDbConfig.databaseId);
    container = database.container(cosmosDbConfig.containerId);

    console.log('Connected to Azure Cosmos DB.');
  } catch (error) {
    console.error('Error initializing Cosmos DB:', error.message);
    throw error;
  }
}

// Expose helper functions to access database and container
function getDatabase() {
  if (!database) throw new Error('Cosmos DB is not initialized.');
  return database;
}

function getContainer() {
  if (!container) throw new Error('Cosmos DB container is not initialized.');
  return container;
}

module.exports = {
  initializeCosmosDb,
  getDatabase,
  getContainer,
};
