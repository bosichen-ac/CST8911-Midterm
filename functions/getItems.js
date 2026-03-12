// used Microsoft Copilot to generate the function code

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const { CosmosClient } = require("@azure/cosmos");

const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
const COSMOS_KEY_SECRET_URI = process.env.COSMOS_KEY_SECRET_URI;
const COSMOS_DB_NAME = process.env.COSMOS_DB_NAME || "db-midterm";
const COSMOS_CONTAINER_NAME = process.env.COSMOS_CONTAINER_NAME || "items";

let _secretCache = { value: null, expiresAt: 0 };
function parseSecretUri(secretUri) {
  const u = new URL(secretUri);
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts[0] !== "secrets") throw new Error("Invalid COSMOS_KEY_SECRET_URI.");
  const name = parts[1];
  const version = parts[2];
  const vaultUrl = `${u.protocol}//${u.host}`;
  return { vaultUrl, name, version };
}
async function getCosmosKey(context) {
  const now = Date.now();
  if (_secretCache.value && _secretCache.expiresAt > now) return _secretCache.value;
  const { vaultUrl, name, version } = parseSecretUri(COSMOS_KEY_SECRET_URI);
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(vaultUrl, credential);
  const secret = await client.getSecret(name, { version });
  _secretCache = { value: secret.value, expiresAt: now + 10 * 60 * 1000 };
  context.log("Cosmos key pulled from Key Vault.");
  return secret.value;
}
async function getCosmosContainer(context) {
  if (!COSMOS_ENDPOINT) throw new Error("COSMOS_ENDPOINT not set.");
  const key = await getCosmosKey(context);
  const client = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key });
  return client.database(COSMOS_DB_NAME).container(COSMOS_CONTAINER_NAME);
}

module.exports = async function (context, req) {

  try {
    const container = await getCosmosContainer(context);
    const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();
    context.res = { status: 200, body: items };
  } catch (err) {
    context.log.error("GetItems failed:", err);
    context.res = { status: 500, body: { error: "Server error fetching items." } };
  }
}