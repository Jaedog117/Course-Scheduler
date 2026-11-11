-- server/sql/seed.sql
INSERT INTO courses (id, number, title, credits, description) VALUES
(1,  'CSC1700', 'Introduction to Programming', 4,
     'Java programming fundamentals. Variables, loops, methods, arrays, and basic OOP.'),
(2,  'CSC2150', 'Data Structures', 4,
     'Linked lists, stacks, queues, trees, graphs, sorting, and algorithm analysis.'),
(3,  'CSC2200', 'Introduction to Web Development', 3,
     'HTML, CSS, JavaScript client-side programming, DOM manipulation, Bootstrap.'),
(4,  'CSC2300', 'Computer Architecture', 3,
     'Digital logic, binary arithmetic, CPU organization, memory hierarchy, assembly language.'),
(5,  'CSC3250', 'Object-Oriented Programming', 3,
     'OOP principles, inheritance, polymorphism, interfaces, design patterns.'),
(6,  'CSC3510', 'Software Testing', 3,
     'Unit testing, integration testing, test-driven development, API testing with Postman.'),
(7,  'CSC3700', 'Advanced Web Application Development', 3,
     'React, Node/Express, MySQL, JWT authentication. Full-stack web development.'),
(8,  'CSC4450', 'Programming Languages', 3,
     'Language paradigms, memory management, C and C++ systems programming, Rust concepts.'),
(9,  'CSC4500', 'Database Systems', 3,
     'Relational databases, SQL, normalization, transactions, database design.'),
(10, 'CSC4990', 'Capstone Project', 3,
     'Semester-long team software project. Real client, full development lifecycle.');

INSERT INTO prerequisites (course_id, prereq_id) VALUES
(2, 1), (3, 1), (4, 1),
(5, 2),
(6, 5),
(7, 3),
(8, 5),
(9, 2),
(10, 6), (10, 7);

-- One user for M2 -- gets id 1
INSERT INTO users (username) VALUES ('student1');

-- student1 has completed CSC1700 and CSC2200
INSERT INTO completions (user_id, course_id) VALUES (1, 1), (1, 3);
