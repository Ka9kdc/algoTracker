

const router = require('express').Router()
const client = require('../db')



router.get('/tags', async(req, res, next) => {
    try{
        const data = await client.query('SELECT * FROM tags;')
        const tags = data.rows
        res.send(tags)
    }catch (error){
        console.error(error)
        next(error)
    }
})


router.get('/:tag', async (req, res, next) => {
    try {
        const data = await client.query('SELECT * FROM problems, algoTagged WHERE algoTagged.tag = $1 AND problems.id = algoTagged.algo_id', [req.params.tag])
        const algos = data.rows
        console.log(algos.length)
        res.send(algos)
    } catch (error){
        console.error()
        next(error)
    }
})
module.exports = router