import sql from "mssql";

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = Number(process.env.AZURE_SQL_PORT || 1433);

if (!server) {
  throw new Error("Missing AZURE_SQL_SERVER in local.settings.json");
}

if (!database) {
  throw new Error("Missing AZURE_SQL_DATABASE in local.settings.json");
}

const sqlConfig: sql.config = {
  server,
  database,
  port,
  authentication: {
    type: "azure-active-directory-default",
    options: {},
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
   connectionTimeout: 30000,
  requestTimeout: 30000,
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getSqlPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(sqlConfig).connect();
  }

  return poolPromise;
}

export async function queryDatabase<T>(query: string): Promise<T[]> {
  const pool = await getSqlPool();
  const result = await pool.request().query<T>(query);

  return result.recordset;
}