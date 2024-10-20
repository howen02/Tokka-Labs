import Database from 'bun:sqlite'

const db = new Database('db.sqlite')

db.query(
	`CREATE TABLE IF NOT EXISTS "transactions" (
        hash TEXT PRIMARY KEY,
        blockNumber INTEGER NOT NULL,
        gasUsed INTEGER NOT NULL,
        gasPrice INTEGER NOT NULL,
        ethPrice REAL NOT NULL,
        timeStamp INTEGER NOT NULL
    )`
).run()

export default db
