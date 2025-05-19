const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 8000;

const pool = new Pool({
    user: 'postgres',
    database: 'palestra'
});

const memberCf = "RSSMRC80A01F205X";
const workoutid = 1;

// middleware
app.use(express.json());
app.use(express.static("public"));

// api
app.get('/api/v1/workouts', async (req, res) => {
    // let memberCf = req.cookies.memberid
    let result = await pool.query(
        "SELECT " +
        "    workout_plan.id, " +
        "    workout_plan.name, " +
        "    workout_plan.difficulty_level, " +
        "    workout_plan.description " +
        "FROM workout_plan " +
        "    JOIN followed_by ON workout_plan.id = followed_by.workout_plan " +
        "    JOIN member ON followed_by.member = member.cf " +
        "WHERE member.cf = '" + `${memberCf}` + "'; "
    );
    res.status(200).send(JSON.stringify(result.rows));
});

app.post('/api/v1/workouts', async (req, res) => {
    // let memberCf = req.cookies.memberid
    const client = await pool.connect();
    const workoutQuery =
        "INSERT INTO \"workout_plan\"(id, name, description, frequency, difficulty_level, sets) VALUES " +
        "(DEFAULT, $1, $2, $3, $4, $5) RETURNING *;";
    const followedByQuery = "INSERT INTO \"followed_by\" (workout_plan, member, status) VALUES " +
        "($1, $2, $3) RETURNING *;";

    console.log("[API] POST(" + req.url + ")  " + JSON.stringify(req.body));
    try {
        await client.query("BEGIN");
        let resultWorkout = await client.query(
            workoutQuery,
            [req.body.name, req.body.description, req.body.frequency, req.body.difficulty, req.body.sets]
        );

        let workoutId = resultWorkout.rows[0].id;
        console.log(resultWorkout.rows);

        let resultFollowedBy = await client.query(
            followedByQuery,
            [workoutId, memberCf, 'ongoing']
        );
        console.log(resultFollowedBy.rows);
        await client.query("COMMIT");

        res.status(200).send(resultWorkout.rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
});

app.get('/api/v1/workout/:workoutid', async (req, res) => {
    // let workoutid = req.params.workoutid
    let result = await pool.query(
        "SELECT  " +
        "    workout_plan.id" +
        "    workout_plan.name AS name, " +
        "    workout_plan.difficulty_level, " +
        "    workout_plan.sets, " +
        "    exercise.name AS exersice, " +
        "    workout_details.reps, " +
        "    exercise.description, " +
        "    equipment.name AS equipment " +
        "FROM workout_plan " +
        "   JOIN workout_details ON workout_details.workout_plan = workout_plan.id " +
        "   JOIN exercise ON workout_details.exercise = exercise.id " +
        "   JOIN equipment ON exercise.equipment = equipment.id " +
        "WHERE workout_plan.id = " + `${workoutid}` + " " +
        "ORDER BY workout_details.exercise_order; "
    );
    res.status(200).send(JSON.stringify(result.rows));
});


app.delete('/api/v1/workouts', async (req, res) => {
    // let workoutid = req.params.workoutid
    console.log("[API] DELETE(" + req.url + ")  " + JSON.stringify(req.body));
    let result = await pool.query(
        "DELETE " +
        "FROM workout_plan " +
        "    USING followed_by " +
        "WHERE followed_by.workout_plan = workout_plan.id " +
        "    AND workout_plan.id = " + `${req.body.id}` + " " +
        "    AND followed_by.member = '" + `${memberCf}` + "';"
    );
    console.log(result.rows)
    res.status(200).send(JSON.stringify(result.rows));
});

// middleware for not found files
app.use((req, res, next) => {
    res.on('finish', () => {
        let d = new Date();
        console
            .log(`[${d.getDate()}/${d.getMonth()}/${d.getYear()} ` +
                `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]:` +
                `${req.ip} : error 404 on : ${req.url}`)
    });
    next();
});
app.use((req, res) => {
    res.status(404).send('invalid url');
    next();
});

// start server
app.listen(port, () => {
    console.log("app listening on http://0.0.0.0:" + port)
    console.log("(i) only errors will be shown (fe. [timestamp]:ip url)")
});
