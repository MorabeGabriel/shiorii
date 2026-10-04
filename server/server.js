import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as games from './gamesRepo.js'

const app = express()

// CORS before the routes. Middleware registered after a route never sees that
// route's requests, which is the m4 lesson showing up in production.
//
// Name your origins. app.use(cors()) with no options sends
// Access-Control-Allow-Origin: *, which lets any site on the internet call this
// API from a visitor's browser, and is incompatible with cookies.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Is the process alive?
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Is the database reachable? A different question, and the one that tells you
// in two seconds which half of a problem you have.
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

const VALID_STATUSES = ['backlog', 'playing', 'completed', 'dropped']

// Validation lives on the server because the client can be bypassed. The
// browser form is for a fast, friendly message; this is for correctness.
function validate(body) {
  const errors = []
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const platform = typeof body.platform === 'string' ? body.platform.trim() : ''
  const status = typeof body.status === 'string' ? body.status.trim() : 'backlog'
  const last_note = typeof body.last_note === 'string' ? body.last_note.trim() : ''
  const last_played_at = body.last_played_at ?? null

  if (!title) errors.push('title is required')
  if (title.length > 120) errors.push('title must be 120 characters or fewer')
  if (platform.length > 60) errors.push('platform must be 60 characters or fewer')
  if (!VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`)
  }
  if (last_note.length > 500) errors.push('last_note must be 500 characters or fewer')

  return { errors, value: { title, platform, status, last_note, last_played_at } }
}

app.get('/api/games', async (request, response, next) => {
  try {
    response.json(await games.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/games/:id', async (request, response, next) => {
  try {
    const row = await games.getById(pool, request.params.id)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.post('/api/games', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await games.create(pool, value))
  } catch (error) {
    next(error)
  }
})

app.put('/api/games/:id', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    const row = await games.update(pool, request.params.id, value)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/games/:id', async (request, response, next) => {
  try {
    const removed = await games.remove(pool, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

// The detail goes in your logs; the visitor gets a plain message. Sending a
// stack trace to a stranger tells them about your file layout and dependencies.
app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

// The host chooses the port and tells you through PORT. Hardcoding 3000 is the
// commonest reason a first deploy is marked unhealthy and killed.
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
