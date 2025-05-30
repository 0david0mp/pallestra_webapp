CREATE TYPE gender
    AS ENUM('f', 'm');
CREATE TYPE membership_status
    AS ENUM('active', 'inactive', 'waiting payment');
CREATE TYPE class_status
    AS ENUM('scheduled', 'cancelled', 'completed');
CREATE TYPE class_frequency
    AS ENUM('weekly', 'monthly');
CREATE TYPE difficulty
    AS ENUM('easy', 'medium', 'hard');
CREATE TYPE equipment_status
    AS ENUM('available', 'maintenance');
CREATE TYPE workout_status
    AS ENUM(
        'ongoing',
        'completed',
        'cancelled (too hard)',
        'cancelled (too easy)'
    );

CREATE TABLE "member" (
    cf              CHAR(16)    NOT NULL,
    first_name      VARCHAR(20) NOT NULL,
    last_name       VARCHAR(20) NOT NULL,
    email           VARCHAR(40) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    gender          GENDER      NOT NULL,
    join_date       DATE        NOT NULL,
    date_of_birth   DATE        NOT NULL,
    pass            VARCHAR(40) NOT NULL,
    PRIMARY KEY(cf)
);

CREATE TABLE "membership" (
    id         SERIAL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    status     MEMBERSHIP_STATUS NOT NULL,
    type       INT,
    PRIMARY KEY(id),
    CONSTRAINT
        dates_order
        CHECK (start_date < end_date),
    CONSTRAINT
        old_end_date
        CHECK (NOT(CURRENT_DATE > end_date AND status != 'inactive'))
);

CREATE TABLE "payment" (
    timestamp  TIMESTAMP NOT NULL,
    membership INT       NOT NULL,
    amount     FLOAT     NOT NULL,
    PRIMARY KEY(timestamp, membership)
);

CREATE TABLE "membership_type" (
    id          SERIAL,
    name        VARCHAR(20) NOT NULL,
    months      INTERVAL    NOT NULL,
    min_members INT         NOT NULL,
    max_members INT         NOT NULL,
    description VARCHAR(200),
    price       FLOAT       NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE "effective_class" (
    class_id        INT          NOT NULL,
    status          CLASS_STATUS NOT NULL,
    start_datetime  TIMESTAMP    NOT NULL,
    PRIMARY KEY(start_datetime, class_id)
);

CREATE TABLE "recurrent_class" (
    id          SERIAL,
    name        VARCHAR(20),
    start_time  TIME NOT NULL,
    duration    INT,
    frequency   CLASS_FREQUENCY NOT NULL,
    month_day   INT,
    week_day    INT,
    trainer     CHAR(16),
    room        INT,
    PRIMARY KEY(id),
    CHECK (duration < 180),
    CHECK (month_day <= 30),
    CHECK (week_day <= 7)
);

CREATE TABLE "trainer" (
    cf              CHAR(16),
    first_name      VARCHAR(20) NOT NULL,
    last_name       VARCHAR(20) NOT NULL,
    email           VARCHAR(40) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    specialization  VARCHAR(40),
    hire_date       DATE NOT NULL,
    salary          INT NOT NULL,
    PRIMARY KEY(cf)
);

CREATE TABLE "room" (
    id              SERIAL,
    name            VARCHAR(20) NOT NULL,
    max_capacity    INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE "attendance" (
    member      CHAR(16),
    timestamp   TIMESTAMP,
    duration    INT,
    PRIMARY KEY(member, timestamp),
    CHECK (duration < 1440)
);

CREATE TABLE "workout_plan" (
    id                  SERIAL,
    name                VARCHAR(40) NOT NULL,
    description         VARCHAR(200),
    frequency           VARCHAR(20),
    difficulty_level    DIFFICULTY,
    sets                INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE "exercise" (
    id              SERIAL,
    name            VARCHAR(40),
    muscle_group    VARCHAR(40),
    description     VARCHAR(200),
    equipment       INT,
    PRIMARY KEY(id)
);

CREATE TABLE "equipment" (
    id      SERIAL,
    name    VARCHAR(20) NOT NULL,
    status  EQUIPMENT_STATUS NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE "part_of" (
    member          CHAR(16),
    membership      INT,
    main            BOOLEAN,
    PRIMARY KEY(member, membership)
);

CREATE TABLE "enrollment" (
    member               CHAR(16),
    class_id             INT,
    class_start_datetime TIMESTAMP,
    timestamp            TIMESTAMP NOT NULL,
    PRIMARY KEY(member, class_id, class_start_datetime)
);

CREATE TABLE "followed_by" (
    workout_plan INT,
    member       CHAR(16),
    status       WORKOUT_STATUS NOT NULL,
    PRIMARY KEY(workout_plan, member)
);

CREATE TABLE "workout_details" (
    exercise        INT NOT NULL,
    workout_plan    INT,
    exercise_order  SMALLINT,
    reps            INT,
    PRIMARY KEY (workout_plan, exercise_order)
);

ALTER TABLE "membership"
ADD CONSTRAINT "membership_type_fkey"
FOREIGN KEY ("type") REFERENCES "membership_type"("id")
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "payment"
ADD CONSTRAINT "payment_membership_fkey"
FOREIGN KEY ("membership") REFERENCES "membership"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "effective_class"
ADD CONSTRAINT "effective_class_class_id_fkey"
FOREIGN KEY ("class_id") REFERENCES "recurrent_class"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "recurrent_class"
ADD CONSTRAINT "recurrent_class_trainer_fkey"
FOREIGN KEY ("trainer") REFERENCES "trainer"("cf")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "recurrent_class"
ADD CONSTRAINT "recurrent_class_room_fkey"
FOREIGN KEY ("room") REFERENCES "room"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "attendance"
ADD CONSTRAINT "attendance_member_fkey"
FOREIGN KEY ("member") REFERENCES "member"("cf")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "exercise"
ADD CONSTRAINT "exercise_equipment_fkey"
FOREIGN KEY ("equipment") REFERENCES "equipment"("id")
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "part_of"
ADD CONSTRAINT "part_of_member_fkey"
FOREIGN KEY ("member") REFERENCES "member"("cf")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "part_of"
ADD CONSTRAINT "part_of_membership_fkey"
FOREIGN KEY ("membership") REFERENCES "membership"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "enrollment"
ADD CONSTRAINT "enrollment_member_fkey"
FOREIGN KEY ("member") REFERENCES "member"("cf")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "enrollment"
ADD CONSTRAINT "enrollment_class_id_start_time_fkey"
FOREIGN KEY ("class_id", "class_start_datetime")
    REFERENCES "effective_class"("class_id", "start_datetime")
        ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "followed_by"
ADD CONSTRAINT "followed_by_workout_plan_fkey"
FOREIGN KEY ("workout_plan") REFERENCES "workout_plan"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "followed_by"
ADD CONSTRAINT "followed_by_member_fkey"
FOREIGN KEY ("member") REFERENCES "member"("cf")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "workout_details"
ADD CONSTRAINT "workout_details_exercise_fkey"
FOREIGN KEY ("exercise") REFERENCES "exercise"("id")
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "workout_details"
ADD CONSTRAINT "workout_details_workout_plan_fkey"
FOREIGN KEY ("workout_plan") REFERENCES "workout_plan"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

