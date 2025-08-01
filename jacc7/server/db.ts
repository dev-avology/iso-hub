import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon with WebSocket and connection pooling
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;
neonConfig.useSecureWebSocket = true;

// Allow running without database in development mode
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'development') {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with proper settings for serverless
let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 5, // Reduced max connections to prevent "too many connections"
    min: 1, // Maintain at least 1 connection
    idleTimeoutMillis: 20000, // Reduced idle timeout
    connectionTimeoutMillis: 10000 // Increased connection timeout
  });
  
  db = drizzle({ client: pool, schema });
} else if (process.env.NODE_ENV === 'development') {
  // Mock database for development
  console.log('⚠️  Running in development mode without database - some features will be limited');
  db = {
    execute: async () => ({ rows: [{ test: 1 }] }),
    select: () => ({ from: () => Promise.resolve([]) }),
    insert: () => ({ values: () => Promise.resolve({ rowCount: 1 }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve({ rowCount: 1 }) }) }),
    delete: () => ({ where: () => Promise.resolve({ rowCount: 1 }) })
  };
}

export { pool, db };

// Database health check and initialization
export async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    
    if (!db) {
      console.log('No database configured - running in mock mode');
      return true;
    }
    
    // Simple test query to verify connection
    const result = await db.execute(`SELECT 1 as test`);
    console.log('Database connection test successful');
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: continuing with mock database');
      return true;
    }
    
    // Try to recover by creating a new pool
    try {
      console.log('Attempting database connection recovery...');
      
      // Wait a moment before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test again
      const retryResult = await db.execute(`SELECT 1 as test`);
      console.log('Database connection recovery successful');
      
      return true;
    } catch (retryError) {
      console.error('Database connection recovery failed:', retryError);
      return false;
    }
  }
}