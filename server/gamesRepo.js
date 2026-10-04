// The data-access layer, the same shape as m5a3.
//
// Every query is parameterised: values go in the array, never into the string.
// This is the single most important habit in database code, and it is what
// stops "'; DROP TABLE games; --" in a form field from being a real problem.

export async function getAll(pool) {
  const result = await pool.query(
    'SELECT * FROM games ORDER BY title ASC'
  )
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM games WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function create(pool, { title, platform, status, last_note, last_played_at }) {
  const result = await pool.query(
    `INSERT INTO games (title, platform, status, last_note, last_played_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, platform ?? '', status ?? 'backlog', last_note ?? '', last_played_at ?? null]
  )
  return result.rows[0]
}

export async function update(pool, id, { title, platform, status, last_note, last_played_at }) {
  const result = await pool.query(
    `UPDATE games
     SET title = $1, platform = $2, status = $3, last_note = $4, last_played_at = $5
     WHERE id = $6
     RETURNING *`,
    [title, platform ?? '', status ?? 'backlog', last_note ?? '', last_played_at ?? null, id]
  )
  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query(
    'DELETE FROM games WHERE id = $1 RETURNING id',
    [id]
  )
  return result.rowCount > 0
}
