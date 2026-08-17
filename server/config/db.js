const mongoose = require('mongoose');

// Serverless functions can run multiple concurrent instances, each re-importing
// this module on a cold start. Caching the connection on `global` means warm
// invocations reuse it instead of opening a fresh connection every request.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongooseInstance) => {
        console.log('MongoDB connected');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
