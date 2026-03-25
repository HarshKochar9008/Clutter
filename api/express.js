const path = require('path')

// Ensure Node can resolve dependencies from the `server/` and `client/` folders.
// Vercel deploys functions from the repo root, so `require('express')` would
// otherwise look for `./node_modules/express` (which doesn't exist).
module.paths.push(path.join(__dirname, '../server/node_modules'))
module.paths.push(path.join(__dirname, '../client/node_modules'))

const connectDB = require('../server/config/db')
const app = require('../server/app')

let mongoConnectPromise = null

async function ensureMongoConnected() {
  if (mongoConnectPromise) return mongoConnectPromise
  mongoConnectPromise = connectDB()
  return mongoConnectPromise
}

module.exports = async (req, res) => {
  await ensureMongoConnected()

  const url = new URL(req.url, 'http://localhost')
  const apiPath = url.searchParams.get('path') || ''
  url.searchParams.delete('path')
  url.pathname = apiPath ? `/api/${apiPath}` : '/api'

  req.url = url.pathname + url.search
  req.originalUrl = req.url

  return app.handle(req, res)
}

