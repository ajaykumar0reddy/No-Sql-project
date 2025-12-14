import neo4j from 'neo4j-driver';

const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

// Singleton driver instance to prevent too many connections
let driver;

try {
  if (!driver) {
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
    );
  }
} catch (error) {
  console.error("Failed to create Neo4j driver:", error);
}

export async function read(cypher, params = {}) {
  const session = driver.session();
  try {
    const res = await session.run(cypher, params);
    return res.records.map(record => record.toObject());
  } finally {
    await session.close();
  }
}

export async function write(cypher, params = {}) {
  const session = driver.session();
  try {
    const res = await session.executeWrite(tx => tx.run(cypher, params));
    return res.records.map(record => record.toObject());
  } finally {
    await session.close();
  }
}

export default driver;
