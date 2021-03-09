

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
        const studySession = req.body.studySession
        const algos = req.body.completedProblems
        const now = new Date()
        if(algos.length){
            const sessionQuery = await client.query('INSERT INTO study_sessions (session_start, session_end, algo_count, duration, tag) VALUES ($1, $2, $3, $4, $5) RETURNING id;', [now,now,algos.length,studySession.sessionLength,studySession.tag])
            const session_id = sessionQuery.rows[0].id
            const queryTracker = 'INSERT INTO tracker (time, algo_id, runtime, runtime_precentile, memory, memory_precentile, date, average_precentile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;'
            const queryBest = 'SELECT tracker.average_precentile, tracker.id FROM tracker, algo_sessions WHERE algo_sessions.best = TRUE AND algo_sessions.algo_id = ($1) AND algo_sessions.tracker_id = tracker.id'
            const insertFirstTime = 'INSERT INTO algo_sessions (session_id, algo_id, tracker_id, average_precentile) VALUES ($1, $2, $3, $4);'
            for(let i = 0; i < algos.length; i++){
                const data = [algos[i].time, algos[i].id, algos[i].runtime, algos[i].runtime_percentile, algos[i].memory, algos[i].memory_percentile, now, algos[i].average_precentile]
                const trackerResult = await client.query(queryTracker, data)
                const tracker_id = trackerResult.rows[0].id

                const bestResult = await  client.query(queryBest, [algos[i].id])
                const bestAverage = bestResult.rows
                if(bestAverage[0]){
                    console.log(bestAverage, i)
                    if(bestAverage[0].average_precentile < algos[i].average_precentile){
                        await client.query(insertFirstTime, [session_id, algos[i].id, tracker_id, algos[i].average_precentile])
                        await client.query(`UPDATE algo_sessions SET best = FALSE WHERE tracker_id = ($1) AND algo_id = ($2)`, [bestAverage[0].id, algos[i].id])
                    } else {
                        await client.query('INSERT INTO algo_sessions (session_id, algo_id, tracker_id, best, average_precentile) VALUES ($1, $2, $3, FALSE, $4);', [session_id, algos[i].id, tracker_id, algos[i].average_precentile])
                    }
                } else {
                    await client.query(insertFirstTime, [session_id, algos[i].id, tracker_id, algos[i].average_precentile])
                }
            }
        }
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = router