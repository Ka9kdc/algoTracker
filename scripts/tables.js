const problemArr = require('./Problems')
const algoTagAssociations = require('./data')
const tagNames = require('./tags')
const {Client} = require('pg')
const client = new Client({
    database: 'algos',
})



const seed = async () => {
    await client.connect()
    
await client.query(`DROP TABLE IF EXISTS  algoTagged, problems, tags CASCADE;`)

const createProblemsTable = `CREATE TABLE IF NOT EXISTS problems(
    id INTEGER PRIMARY KEY,
    title varChar(255) NOT NULL,
    level varChar(22) NOT NULL,
    frequency INTEGER NOT NULL,
    acceptance INTEGER NOT NULL
);`

const createTagssTable = `CREATE TABLE IF NOT EXISTS tags(
    id  SERIAL PRIMARY KEY,
    tag varChar(22) NOT NULL UNIQUE
);`

const createAlgoTaggedTable = `CREATE TABLE IF NOT EXISTS algoTagged(
    algo_id INTEGER REFERENCES problems (id),
    tag varCHAR(22) REFERENCES tags (tag),
    frequency INTEGER NOT NULL
);`

const createTracker = `CREATE TABLE IF NOT EXISTS tracker(
    id  SERIAL PRIMARY KEY,
    time INTEGER NOT NULL,
    algo_id INTEGER REFERENCES problems (id) NOT NULL,
    runtime INTEGER NOT NULL,
    runtime_precentile INTEGER NOT NULL,
    memory INTEGER NOT NULL,
    memory_precentile INTEGER NOT NULL,
    date timestamp with time zone NOT NULL,
    average_precentile INTEGER NOT NULL
);`
try {
    await client.query(createProblemsTable)
    await client.query(createTagssTable)
    await client.query(createAlgoTaggedTable)
    await client.query(createTracker)
} catch (err) {
    console.error(err.stack)
}
console.log("Tables Made")
const insertStatement = 'INSERT INTO problems (id, title,level,frequency,acceptance) VALUES ($1, $2, $3, $4, $5);'
for(let i = 0; i < problemArr.length; i++){
    try{
        await client.query(insertStatement, problemArr[i])
    } catch (err) {
        console.error(err.stack)
    }
}

const insertTag = 'INSERT INTO tags (tag) VALUES ($1);'
for(let i = 0; i < tagNames.length; i++){
    try{
        await client.query(insertTag, [tagNames[i]])
    } catch (err){
        console.error(err.stack)
    }
}

const insertStatement2 = 'INSERT INTO algoTagged (algo_id, frequency, tag) VALUES ($1, $2, $3);'
for(let i = 0; i < algoTagAssociations.length; i++){
    try{
        await client.query(insertStatement2, algoTagAssociations[i])

    } catch (err) {
        console.error(err.stack)
    }
}
console.log("Tables Seeded")
client.end()
}
seed()