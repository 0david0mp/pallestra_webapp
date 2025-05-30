const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { Pool } = require('pg');
const authMiddleware = require('../authMiddleware');
const JWT_SECRET = process.env.JWT_SECRET; // for login request

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const router = new express.Router();
router.use(cookieParser());

// -------------------- api
// ---------- contact
router.post('/api/v1/contact', (req, res) => {
    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + JSON.stringify(req.body));

    try {
        fs.appendFileSync('logs/contact-form', JSON.stringify(req.body, null, 4));
        res.send(JSON.stringify({ success: true }));
    } catch (e) {
        console.log(e);
        res.status(500).send(JSON.stringify({ success: false }));
    }
});

// ---------- login
router.post('/api/v1/login', async (req, res) => {
    let result = await pool.query(
        `SELECT
            member.cf
        FROM member
        WHERE member.cf = $1;
        `, [req.body.cf]
    );

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + req.body.cf + "\n\t" + JSON.stringify(result.rows));
    res.status((result.rowCount === 0) ? 403 : 200)

    if (res.statusCode === 403) {
        res.end();
        return;
    }

    let payload = { user: req.body.cf };
    let token = jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS256', expiresIn: '14d'
    });
    res.cookie('token', token, { httpOnly: true, maxAge: 14 * 24 * 3600 * 1000 });
    res.send();
});

router.get('/api/v1/logout', authMiddleware, async (req, res) => {
    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + req.payload.user);

    res.clearCookie('token').send();
});

// ---------- workouts
// list workouts of a user
router.get('/api/v1/workouts', authMiddleware, async (req, res) => {
    let memberCf = req.payload.user;

    let result = await pool.query(
        `SELECT
            workout_plan.id,
            workout_plan.name,
            workout_plan.difficulty_level,
            workout_plan.description
        FROM workout_plan
            JOIN followed_by ON workout_plan.id = followed_by.workout_plan
            JOIN member ON followed_by.member = member.cf
        WHERE member.cf = $1;
        `, [memberCf]
    );

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + memberCf);
    res.status(200).send(JSON.stringify(result.rows));
});

// new workout of a user
router.post('/api/v1/workouts', authMiddleware, async (req, res) => {
    let memberCf = req.payload.user

    const client = await pool.connect();
    const workoutQuery =
        `INSERT INTO "workout_plan"(id, name, description, frequency, difficulty_level, sets) VALUES
        (DEFAULT, $1, $2, $3, $4, $5) RETURNING *;`;
    const followedByQuery = `INSERT INTO "followed_by" (workout_plan, member, status) VALUES 
        ($1, $2, 'ongoing') RETURNING *;`;

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
            [workoutId, memberCf]
        );
        console.log(resultFollowedBy.rows);
        await client.query("COMMIT");

        res.status(200).send(resultWorkout.rows[0]);
    } catch (e) {
        console.log('ROLLBACK')
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
});

// delete workout of a user
router.delete('/api/v1/workouts', authMiddleware, async (req, res) => {
    let memberCf = req.payload.user
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

    if (result.rowCount === 1) {
        res.status(200).send(JSON.stringify(result.rows));
    } else {
        res.status(404).end();
    }
});

// ---------- exercises
// list exercises on a workout
router.get('/api/v1/workout/:workoutid', authMiddleware, async (req, res) => {
    let workoutId = req.params.workoutid
    let memberCf = req.payload.user

    let result = await pool.query(
        `SELECT 
            workout_plan.name,
            workout_plan.difficulty_level AS difficulty,
            workout_plan.sets,
            workout_plan.frequency,
            workout_plan.description
        FROM workout_plan
            JOIN followed_by ON followed_by.workout_plan = workout_plan.id
            JOIN member ON followed_by.member = member.cf
        WHERE workout_plan.id = $1
            AND member.cf = $2;
        `,
        [parseInt(workoutId), memberCf]
    );

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + memberCf);

    if (result.rowCount === 0) {
        console.log("FORBIDDEN");
        res.status(403).send(JSON.stringify({ details: { name: 'FORBIDDEN', description: 'you cannot watch this workout' } }));
        return;
    }

    let workoutDetails = result.rows[0];

    result = await pool.query(
        `SELECT
            exercise.id AS id,
            workout_details.exercise_order AS order,
            exercise.name AS name,
            workout_details.reps,
            equipment.name AS equipment,
            exercise.description
        FROM workout_plan
            JOIN workout_details ON workout_details.workout_plan = workout_plan.id
            JOIN exercise ON workout_details.exercise = exercise.id
            LEFT JOIN equipment ON exercise.equipment = equipment.id
        WHERE workout_plan.id = $1
        ORDER BY workout_details.exercise_order;`,
        [workoutId]
    );

    const response = JSON.stringify({ details: workoutDetails, rows: result.rows })

    console.log(response)
    res.status(200).send(response);
});

// new exercise for a workout
router.post('/api/v1/workout/:workoutid', async (req, res) => {
    // TODO: check user
    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + JSON.stringify(req.body));

    let result = await pool.query(
        `INSERT INTO "workout_details" (workout_plan, exercise, exercise_order, reps) VALUES
            ($1,
            $2,
            (SELECT COALESCE(MAX(exercise_order::integer), 0) + 1 FROM workout_details WHERE workout_details.workout_plan = $1),
            $3)
        RETURNING *;
        `,
        [req.params.workoutid, req.body.exercise, req.body.reps]
    );

    let data = result.rows[0];

    result = await pool.query(
        `SELECT name, description
        FROM exercise WHERE id = $1;
        `, [req.body.exercise]);

    data.name = result.rows[0].name;
    data.description = result.rows[0].description

    res.status(200).send(data);
});

// delete exercise from workout
router.delete('/api/v1/workout/:workoutid', authMiddleware, async (req, res) => {
    let memberCf = req.payload.user;

    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + JSON.stringify(req.body));

    let result = await pool.query(`
        DELETE
        FROM workout_details
            USING workout_plan, followed_by
        WHERE
            workout_details.workout_plan = workout_plan.id
            AND followed_by.workout_plan = workout_plan.id
            AND workout_plan.id = $1
            AND followed_by.member = $2
            AND workout_details.exercise_order = $3
        RETURNING *;`,
        [req.params.workoutid, memberCf, req.body.order]);

    if (result.rowCount === 0) {
        res.status(403).end();
    } else {
        res.status(200).send(result.rows);
    }
});

// list all the exercises (for selecting when adding a exercise)
router.get('/api/v1/exercises', authMiddleware, async (req, res) => {
    let memberCf = req.payload.user;
    console.log("[API]" + req.ip + ": " + req.method + "(" + req.url + ")  " + memberCf);

    let result = await pool.query(
        `SELECT *
        FROM exercise;`
    );

    res.status(200).send(JSON.stringify(result.rows));
});

module.exports = router;
