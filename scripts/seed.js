const algoTagAssociations = require('./data')
const {Client} = require('pg')
const client = new Client({
    database: 'algos',
})

const seed = async () => {
    await client.connect()
const insertStatement2 = 'INSERT INTO algoTagged (algo_id, frequency, tag) VALUES ($1, $2, $3);'
for(let i = 0; i < algoTagAssociations.length; i++){
    try{
        await client.query(insertStatement2, algoTagAssociations[i])
        
    } catch (err) {
        console.error(err.stack)
    }
}
client.end()
}
seed()