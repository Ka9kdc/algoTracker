

const router = require('express').Router()
const client = require('../db')



router.get('/tags', async(req, res, next) => {
    try{
        const data = await client.query('SELECT * FROM tags;')
        const tags = data.rows
        res.send(tags)
    }catch (error){
        next(error)
    }
})

router.get('/any', async (req, res,next) => {
    try {
        const data = await client.query('SELECT * FROM problems ORDER BY level ASC LIMIT 15')
        const algos  = data.rows
        res.send(algos)
    } catch (error){
        next(error)
    }
})


router.get('/:tag', async (req, res, next) => {
    try {
        const data = await client.query('SELECT * FROM problems, algoTagged WHERE algoTagged.tag = $1 AND problems.id = algoTagged.algo_id', [req.params.tag])
        const algos = data.rows
        res.send(algos)
    } catch (error){
        next(error)
    }
})

router.post('/completedProblems', async(req, res, next) => {
    try {
        const algos = req.body.completedProblems
        if(algos.length){
            const query = 'INSERT INTO tracker (time, algo_id, runtime, runtime_precentile, memory, memory_precentile, date, average_precentile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);'
            for(let i = 0; i < algos.length; i++){
                const data =[algos[i].time, algos[i].id, algos[i].runtime, algos[i].runtime_precentile, algos[i].memory, algos[i].memory_precentile, algos[i].date, algos[i].average_precentile]
                await client.query(query, data)
            }
        }
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = router