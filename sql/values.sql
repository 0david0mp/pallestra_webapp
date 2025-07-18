-- 1. MEMBER table
INSERT INTO "member" (cf, first_name, last_name, email, phone, gender, join_date, date_of_birth, pass) VALUES
('RSSMRC80A01F205X', 'Marco',      'Rossi', 'marco.rossi@email.it', '+39 320 4567890',          'm', '2025-01-15', '1980-01-01', 'RSSMRC80A01F205X_123'),
('BNCGLA85B42F205Y', 'Giulia',     'Bianchi', 'giulia.bianchi@email.it', '+39 320 4567891',     'f', '2025-02-20', '1985-02-02', 'BNCGLA85B42F205Y_123'),
('FRRLSS90C03F205Z', 'Alessandro', 'Ferrari', 'alessandro.ferrari@email.it', '+39 320 4567892', 'm', '2025-03-10', '1990-03-03', 'FRRLSS90C03F205Z_123'),
('RMNSFA88D44F205A', 'Sofia',      'Romano', 'sofia.romano@email.it', '+39 320 4567893',        'f', '2025-04-05', '1988-04-04', 'RMNSFA88D44F205A_123'),
('SPSFNC92E05F205B', 'Francesca',  'Esposito', 'francesca.esposito@email.it', '+39 320 4567894','f', '2025-05-18', '1992-05-05', 'SPSFNC92E05F205B_123'),
('RCCMTT87F06F205C', 'Matteo',     'Ricci', 'matteo.ricci@email.it', '+39 320 4567895',         'm', '2025-06-22', '1987-06-06', 'RCCMTT87F06F205C_123'),
('MRNCRN94G47F205D', 'Chiara',     'Marino', 'chiara.marino@email.it', '+39 320 4567896',       'f', '2025-07-30', '1994-07-07', 'MRNCRN94G47F205D_123'),
('GRCLNZ89H08F205E', 'Lorenzo',    'Greco', 'lorenzo.greco@email.it', '+39 320 4567897',        'm', '2025-08-12', '1989-08-08', 'GRCLNZ89H08F205E_123'),
('BRNVNT93I49F205F', 'Valentina',  'Bruno', 'valentina.bruno@email.it', '+39 320 4567898',      'f', '2025-09-25', '1993-09-09', 'BRNVNT93I49F205F_123'),
('GLLNDR91L10F205G', 'Andrea',     'Gallo', 'andrea.gallo@email.it', '+39 320 4567899',         'm', '2025-10-30', '1991-10-10', 'GLLNDR91L10F205G_123');

-- 2. MEMBERSHIP_TYPE table
INSERT INTO "membership_type" (name, description, months, min_members, max_members, price) VALUES
('Basic',   'Basic access to all the equipment and courses.',
       '1 month', 1, 1, 20),
('Basic',   'Basic access to all the equipment and courses.',
       '2 month', 1, 1, 37.5),
('Basic',   'Basic access to all the equipment and courses.',
       '3 month', 1, 1, 50),
('Couple',  'Basic access to all the equipment and courses.  For you and your couple or friend.',
       '1 month', 2, 2, 37.5),
('Couple',  'Basic access to all the equipment and courses.  For you and your couple or friend.',
       '2 month', 2, 2, 70),
('Family',  'Basic access to all the equipment and courses.  For all your family or group of friends.',
       '1 month', 4, 6, 80),
('Youth',   'Basic access to all the equipment and courses.  For the youngest, to start early in life on fitness',
       '1 month', 1, 1, 15),
('Premium', 'Basic access to all the equipment and courses and to personal tracking and profesional advice',
       '2 month', 1, 1, 35);

-- 3. MEMBERSHIP table
INSERT INTO "membership" (start_date, end_date, status, type) VALUES
('2025-05-25', DATE '2028-05-25' + INTERVAL '1 month', 'waiting payment',  6),
('2025-06-03', DATE '2028-06-03' + INTERVAL '1 month', 'waiting payment',  1),
('2025-06-10', DATE '2028-06-10' + INTERVAL '2 month', 'waiting payment',  2),
('2023-03-01', DATE '2026-03-01' + INTERVAL '2 month', 'inactive',  2),
('2025-05-18', DATE '2028-05-18' + INTERVAL '3 month', 'inactive',  3),
('2025-06-22', DATE '2028-06-22' + INTERVAL '3 month', 'active',    3),
('2024-07-30', DATE '2027-07-30' + INTERVAL '1 month', 'inactive',  4),
('2024-08-12', DATE '2027-08-12' + INTERVAL '1 month', 'inactive',  4),
('2024-09-25', DATE '2027-09-25' + INTERVAL '2 month', 'inactive',  2),
('2024-10-30', DATE '2027-10-30' + INTERVAL '2 month', 'inactive',  2),
('2025-05-25', DATE '2028-05-25' + INTERVAL '1 month', 'waiting payment',  1);

-- 4. PAYMENT table
INSERT INTO "payment" (timestamp, membership, amount) VALUES
('2025-01-15 10:30:00', 1,  80.0),
('2025-02-20 14:45:00', 2,  20.0),
('2025-03-10 09:15:00', 3,  37.5),
('2025-04-05 16:20:00', 4,  37.5),
('2025-05-18 11:30:00', 5,  50.0),
('2025-06-22 13:40:00', 6,  50.0),
('2025-07-30 15:10:00', 7,  37.5),
('2025-08-12 10:05:00', 8,  37.5),
('2025-09-25 17:25:00', 9,  37.5),
('2025-10-30 12:15:00', 10, 37.5);

-- 7. TRAINER table
INSERT INTO "trainer" (cf, first_name, last_name, email, phone, specialization, hire_date, salary) VALUES
('VRDLCA75H01F205H', 'Luca', 'Verdi', 'luca.verdi@gym.it', '+39 320 9876543', 'Strength Training', '2020-03-15', 2200),
('BLUGNN80I42F205I', 'Giovanna', 'Blu', 'giovanna.blu@gym.it', '+39 320 9876544', 'Yoga', '2020-05-20', 2000),
('NROSRG85L03F205J', 'Sergio', 'Neri', 'sergio.neri@gym.it', '+39 320 9876545', 'Cardio', '2021-01-10', 1900),
('RSSSMN78M44F205K', 'Simona', 'Rossi', 'simona.rossi@gym.it', '+39 320 9876546', 'Pilates', '2021-03-22', 2100),
('VTLLSS82N05F205L', 'Alessio', 'Vitali', 'alessio.vitali@gym.it', '+39 320 9876547', 'CrossFit', '2021-07-15', 2300),
('BLLSRA77O06F205M', 'Sara', 'Belli', 'sara.belli@gym.it', '+39 320 9876548', 'Spinning', '2022-02-01', 1950),
('MRNFNC83P47F205N', 'Francesca', 'Marini', 'francesca.marini@gym.it', '+39 320 9876549', 'Boxing', '2022-05-10', 2050),
('CNTDVD79Q08F205O', 'Davide', 'Conti', 'davide.conti@gym.it', '+39 320 9876550', 'Swimming', '2022-09-15', 2150),
('FRRFRC84R49F205P', 'Federica', 'Ferrari', 'federica.ferrari@gym.it', '+39 320 9876551', 'Dance Fitness', '2025-01-20', 1900),
('BNCGCP81S10F205Q', 'Giacomo', 'Bianchi', 'giacomo.bianchi@gym.it', '+39 320 9876552', 'Functional Training', '2025-04-05', 2000);

-- 8. ROOM table
INSERT INTO "room" (name, max_capacity) VALUES
('Sala Principale', 50),
('Studio Yoga', 20),
('Area Cardio', 30),
('Sala Pesi', 40),
('Piscina', 25),
('Studio Pilates', 15),
('Sala Spinning', 20),
('Area Funzionale', 25),
('Sala Boxe', 15),
('Studio Danza', 20);

-- 6. RECURRENT_CLASS table
INSERT INTO "recurrent_class" (name, start_time, duration, frequency, month_day, week_day, trainer, room) VALUES
('Yoga Flow',  '09:00:00', 60, 'weekly', NULL, 1, 'VRDLCA75H01F205H', 2),
('Yoga Flow',  '09:00:00', 60, 'weekly', NULL, 3, 'VRDLCA75H01F205H', 2),
('Strength',   '17:00:00', 60, 'weekly', NULL, 2, 'NROSRG85L03F205J', 4),
('Pilates',    '10:00:00', 55, 'weekly', NULL, 4, 'RSSSMN78M44F205K', 6),
('CrossFit',   '19:00:00', 60, 'monthly', 25, NULL, 'VTLLSS82N05F205L', 8),
('Aqua Gym',   '11:00:00', 45, 'monthly', 11, NULL, 'BLLSRA77O06F205M', 5),
('Cardio Burn','12:30:00', 50, 'weekly', NULL, 1, 'MRNFNC83P47F205N', 3),
('Boxing',     '20:00:00', 60, 'weekly', NULL, 2, 'CNTDVD79Q08F205O', 9),
('Zumba',      '19:30:00', 60, 'weekly', NULL, 3, 'FRRFRC84R49F205P', 10),
('Functional','16:00:00', 60, 'weekly', NULL, 4, 'BNCGCP81S10F205Q', 8);

-- 5. EFFECTIVE_CLASS table
INSERT INTO "effective_class" (class_id, status, start_datetime) VALUES
(1,  'completed', '2024-01-01 09:00:00'),
(2,  'completed', '2024-01-01 18:30:00'),
(3,  'completed', '2024-01-01 17:00:00'),
(4,  'completed', '2024-01-01 10:00:00'),
(5,  'completed', '2024-01-01 19:00:00'),
(6,  'completed', '2024-01-01 11:00:00'),
(7,  'completed', '2024-01-01 09:00:00'),
(8,  'completed', '2024-01-01 18:30:00'),
(9,  'cancelled', '2024-01-01 17:00:00'),
(10, 'scheduled', '2024-01-01 10:00:00');

-- 9. ATTENDANCE table
INSERT INTO "attendance" (member, timestamp, duration) VALUES
('RSSMRC80A01F205X', '2025-01-16 10:00:00', 90),
('BNCGLA85B42F205Y', '2025-02-21 16:30:00', 60),
('FRRLSS90C03F205Z', '2025-03-11 18:00:00', 120),
('RMNSFA88D44F205A', '2025-04-06 09:30:00', 75),
('SPSFNC92E05F205B', '2025-05-19 17:00:00', 90),
('RCCMTT87F06F205C', '2025-06-23 11:30:00', 60),
('MRNCRN94G47F205D', '2025-07-31 14:00:00', 120),
('GRCLNZ89H08F205E', '2025-08-13 19:45:00', 90),
('BRNVNT93I49F205F', '2025-09-26 10:15:00', 75),
('GLLNDR91L10F205G', '2025-10-31 16:00:00', 60);

-- 10. WORKOUT_PLAN table
INSERT INTO "workout_plan" (name, description, frequency, difficulty_level, sets) VALUES
('Beginner Strength', 'Basic strength training program for beginners', '3x per week', 'easy', 3),
('Cardio Blast', 'High intensity cardio workout', '4x per week', 'medium', 4),
('Full Body Toning', 'Complete body workout for toning muscles', '3x per week', 'medium', 3),
('Advanced Strength', 'Challenging strength program for experienced lifters', '4x per week', 'hard', 5),
('Core Focus', 'Targeted core strengthening exercises', '2x per week', 'easy', 3),
('Endurance Builder', 'Program to improve cardiovascular endurance', '5x per week', 'medium', 2),
('Functional Fitness', 'Exercises that mirror everyday movements', '3x per week', 'medium', 3),
('Powerlifting', 'Strength training focusing on three main lifts', '4x per week', 'hard', 5),
('Flexibility & Mobility', 'Exercises to improve range of motion', '2x per week', 'easy', 2),
('HIIT Training', 'High-intensity interval training for fat loss', '3x per week', 'hard', 4);

-- 12. EQUIPMENT table
INSERT INTO "equipment" (name, status) VALUES
('Tapis Roulant', 'available'),
('Cyclette', 'available'),
('Panca Piana', 'available'),
('Bilanciere', 'available'),
('Kettlebell', 'available'),
('TRX', 'maintenance'),
('Stepper', 'available'),
('Ellittica', 'available'),
('Pressa Gambe', 'maintenance'),
('Cavi', 'available');

-- 11. EXERCISE table
INSERT INTO "exercise" (name, muscle_group, description, equipment) VALUES
('Bench Press', 'Chest', 'Lie on bench and push barbell upward', 3),
('Squats', 'Legs', 'Lower body exercise targeting quadriceps, glutes, and hamstrings', 4),
('Deadlift', 'Back', 'Full body exercise with focus on back muscles', 4),
('Lunges', 'Legs', 'Forward stepping exercise for legs', NULL),
('Pull-ups', 'Back', 'Upper body exercise focusing on lats', NULL),
('Russian Twists', 'Core', 'Seated rotation exercise for obliques', 5),
('Leg Press', 'Legs', 'Machine exercise for quadriceps', 9),
('Treadmill Running', 'Cardio', 'Cardiovascular exercise on treadmill', 1),
('Bicep Curls', 'Arms', 'Isolation exercise for biceps', 4),
('Cable Rows', 'Back', 'Back exercise with cable machine', 10);

-- 13. PART_OF table
INSERT INTO "part_of" (member, membership, main) VALUES
('RSSMRC80A01F205X', 1, TRUE),
('BNCGLA85B42F205Y', 1, FALSE),
('FRRLSS90C03F205Z', 1, FALSE),
('RMNSFA88D44F205A', 1, FALSE),
('SPSFNC92E05F205B', 5, TRUE),
('RCCMTT87F06F205C', 6, TRUE),
('MRNCRN94G47F205D', 7, TRUE),
('GRCLNZ89H08F205E', 8, TRUE),
('BRNVNT93I49F205F', 9, TRUE),
('GLLNDR91L10F205G', 10, TRUE),
('RMNSFA88D44F205A', 11, TRUE);

-- 14. ENROLLMENT table
INSERT INTO "enrollment" (member, class_id, class_start_datetime, timestamp) VALUES
('RSSMRC80A01F205X', 1,  '2024-01-01 09:00:00', '2025-01-01 12:00:00'),
('BNCGLA85B42F205Y', 2,  '2024-01-01 18:30:00', '2025-01-02 10:30:00'),
('FRRLSS90C03F205Z', 3,  '2024-01-01 17:00:00', '2025-01-03 14:45:00'),
('RMNSFA88D44F205A', 4,  '2024-01-01 10:00:00', '2025-01-04 09:15:00'),
('SPSFNC92E05F205B', 5,  '2024-01-01 19:00:00', '2025-01-05 16:30:00'),
('RCCMTT87F06F205C', 6,  '2024-01-01 11:00:00', '2025-01-06 13:20:00'),
('MRNCRN94G47F205D', 7,  '2024-01-01 09:00:00', '2025-01-08 10:45:00'),
('GRCLNZ89H08F205E', 8,  '2024-01-01 18:30:00', '2025-01-09 17:05:00'),
('BRNVNT93I49F205F', 9,  '2024-01-01 17:00:00', '2025-01-10 11:30:00'),
('GLLNDR91L10F205G', 10, '2024-01-01 10:00:00', '2025-01-11 15:40:00');

-- 15. FOLLOWED_BY table
INSERT INTO "followed_by" (workout_plan, member, status) VALUES
(1, 'RSSMRC80A01F205X', 'ongoing'),
(2, 'BNCGLA85B42F205Y', 'ongoing'),
(3, 'FRRLSS90C03F205Z', 'completed'),
(4, 'RMNSFA88D44F205A', 'ongoing'),
(5, 'SPSFNC92E05F205B', 'cancelled (too hard)'),
(6, 'RCCMTT87F06F205C', 'ongoing'),
(7, 'MRNCRN94G47F205D', 'completed'),
(8, 'GRCLNZ89H08F205E', 'ongoing'),
(9, 'BRNVNT93I49F205F', 'cancelled (too easy)'),
(10, 'GLLNDR91L10F205G', 'ongoing');

-- 16. WORKOUT_DETAILS table
INSERT INTO "workout_details" (workout_plan, exercise_order, exercise, reps) VALUES
(1,  1, 1,  10),
(1,  2, 2,  12),
(1,  3, 3,  8),
(2,  1, 4,  15),
(2,  2, 8,  20),
(3,  1, 5,  12),
(3,  2, 6,  15),
(3,  3, 9,  10),
(4,  1, 3,  6),
(4,  2, 1,  8),
(4,  3, 2,  10),
(4,  4, 7,  12),
(5,  1, 6,  20),
(5,  2, 10, 15),
(6,  1, 8,  30),
(7,  1, 4,  15),
(7,  2, 5,  12),
(7,  3, 10, 12),
(8,  1, 3,  5),
(8,  2, 2,  5),
(8,  3, 1,  5),
(9,  1, 4,  10),
(9,  2, 5,  10),
(10, 1, 8,  20),
(10, 2, 4,  20),
(10, 3, 6,  15),
(10, 4, 9,  15);
