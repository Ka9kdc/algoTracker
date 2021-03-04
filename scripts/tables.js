const problemArr = require('./Problems')
const {Client} = require('pg')
const client = new Client({
    database: 'algos',
})
const seed = async () => {
await client.connect()


const createProblemsTable = `CREATE TABLE problems(
    id INTEGER PRIMARY KEY,
    title varChar(255) NOT NULL,
    level varChar(22) NOT NULL,
    frequency INTEGER NOT NULL,
    acceptance INTEGER NOT NULL
);`

await client.query(createProblemsTable)

const insertStatement = 'INSERT INTO problems (id, title,level,frequency,acceptance) VALUES ($1, $2, $3, $4, $5);'
for(let i = 0; i < problemArr.length; i++){
    try{
        await client.query(insertStatement, problemArr[i])
    } catch (err) {
        console.error(err.stack)
    }
}

client.end()
}
seed()