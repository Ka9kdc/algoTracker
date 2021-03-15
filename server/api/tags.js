

const router = require('express').Router()
const client = require('../db')


router.get('/', async(req, res, next) => {
    try {
        const data = await client.query('SELECT * FROM tags ORDER BY tag;')
        const tags = data.rows
        res.send(tags)
    } catch (error){
        next(error)
    }
})

router.get('/any', async (req, res, next) => {
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
        const data = await client.query('SELECT * FROM problems, algoTagged WHERE algoTagged.tag = $1 AND problems.id = algoTagged.algo_id ORDER BY level ASC LIMIT 15', [req.params.tag])
        const algos = data.rows
        // if(algos.length < 10){
        //     const reminder = 10 - algos.length
        //     const dataAny = await client.query('SELECT * FROM problems ORDER BY level ASC LIMIT $1', [reminder])
        //     algos.concat(dataAny.rows)
        // }
        res.send(algos)
    } catch (error){
        next(error)
    }
})


module.exports = router
