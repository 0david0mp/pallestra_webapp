const express = require('express');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./authMiddleware');

const app = express();
const port = 8000;

const pool = new Pool({
    user: 'postgres',
    database: 'palestra'
});

const memberCf = "RSSMRC80A01F205X";

// -------------------- middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use('/private', authMiddleware, express.static("private"));

// -------------------- api
app.post('/api/v1/login', async (req, res) => {
    let result = await pool.query(
        "SELECT " +
        "    member.cf " +
        "FROM member " +
        "WHERE member.cf = '" + `${req.body.cf}` + "'; "
    );

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + req.body.cf + "\n\t" + JSON.stringify(result.rows));
    res.status((result.rowCount === 0) ? 403 : 200)

    if (res.statusCode === 403) {
        res.end();
        return;
    }

    res.cookie('user', req.body.cf, { httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000 });
    res.send();
});

app.get('/api/v1/logout', async (req, res) => {
    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + req.cookies.user);

    res.clearCookie('user').send();
});

app.get('/api/v1/workouts', async (req, res) => {
    let memberCf = req.cookies.user;

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

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + memberCf);
    res.status(200).send(JSON.stringify(result.rows));
});

app.post('/api/v1/workouts', async (req, res) => {
    let memberCf = req.cookies.user

    const client = await pool.connect();
    const workoutQuery =
        "INSERT INTO \"workout_plan\"(id, name, description, frequency, difficulty_level, sets) VALUES " +
        "(DEFAULT, $1, $2, $3, $4, $5) RETURNING *;";
    const followedByQuery = "INSERT INTO \"followed_by\" (workout_plan, member, status) VALUES " +
        "($1, $2, $3) RETURNING *;";

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + JSON.stringify(req.body));
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
    let workoutid = req.params.workoutid
    let memberCf = req.cookies.user

    let result = await pool.query(
        "SELECT " +
        "    workout_plan.id " +
        "FROM workout_plan " +
        "    JOIN followed_by ON followed_by.workout_plan = workout_plan.id " +
        "    JOIN member ON followed_by.member = member.cf " +
        "WHERE workout_plan.id = $1" +
        "    AND member.cf = $2;",
        [parseInt(workoutid), memberCf]
    );

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + memberCf);

    if (result.rowCount === 0) {
        console.log("FORBIDDEN");
        res.status(403).end();
        return;
    }

    result = await pool.query(
        "SELECT " +
        "    workout_plan.id, " +
        "    workout_plan.name AS name, " +
        "    workout_plan.difficulty_level, " +
        "    workout_plan.sets, " +
        "    exercise.name AS exersice, " +
        "    workout_details.reps, " +
        "    exercise.description, " +
        "    equipment.name AS equipment " +
        "FROM workout_plan " +
        "    JOIN workout_details ON workout_details.workout_plan = workout_plan.id " +
        "    JOIN exercise ON workout_details.exercise = exercise.id " +
        "    JOIN equipment ON exercise.equipment = equipment.id " +
        "    JOIN followed_by ON followed_by.workout_plan = workout_plan.id " +
        "    JOIN member ON followed_by.member = member.cf " +
        "WHERE workout_plan.id = $1 " +
        "    AND member.cf = $2 " +
        "ORDER BY workout_details.exercise_order;",
        [workoutid, memberCf]
    );

    res.status(200).send(JSON.stringify(result.rows));
});


app.delete('/api/v1/workouts', async (req, res) => {
    let memberCf = req.cookies.user
    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + JSON.stringify(req.body));
    let result = await pool.query(
        `DELETE
         FROM workout_plan
             USING followed_by
         WHERE followed_by.workout_plan = workout_plan.id
             AND workout_plan.id = $1
             AND followed_by.member = $2
         RETURNING *;`, [req.body.id, memberCf]
    );

    if (rowCount === 1) {
        res.status(200).send(JSON.stringify(result.rows));
    } else {
        res.status(404).end();
    }
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
});

// start server
app.listen(port, () => {
    console.log("app listening on http://0.0.0.0:" + port)
});
