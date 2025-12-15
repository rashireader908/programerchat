-- Seed interview prompts

-- Technical prompts
INSERT INTO interview_prompts (category, difficulty, prompt_text) VALUES
('technical', 'junior', 'Explain the difference between let, const, and var in JavaScript.'),
('technical', 'junior', 'What is the difference between == and === in JavaScript?'),
('technical', 'junior', 'Explain what a closure is in JavaScript.'),
('technical', 'junior', 'What is the difference between null and undefined?'),
('technical', 'junior', 'Explain the concept of hoisting in JavaScript.'),
('technical', 'mid', 'Explain how React hooks work. What are the rules of hooks?'),
('technical', 'mid', 'What is the difference between a class component and a functional component in React?'),
('technical', 'mid', 'Explain the concept of virtual DOM and how it improves performance.'),
('technical', 'mid', 'What is the difference between SQL and NoSQL databases? When would you use each?'),
('technical', 'mid', 'Explain RESTful API design principles.'),
('technical', 'mid', 'What is the difference between synchronous and asynchronous programming?'),
('technical', 'mid', 'Explain how authentication and authorization differ.'),
('technical', 'senior', 'Explain how you would design a scalable caching system.'),
('technical', 'senior', 'How would you optimize a slow database query?'),
('technical', 'senior', 'Explain the CAP theorem and its implications for distributed systems.'),
('technical', 'senior', 'How would you handle rate limiting in a distributed system?'),
('technical', 'senior', 'Explain the difference between microservices and monolithic architecture.'),
('technical', 'senior', 'How would you design a system to handle millions of concurrent users?'),

-- Behavioral prompts
('behavioral', 'junior', 'Tell me about a time when you had to learn a new technology quickly.'),
('behavioral', 'junior', 'Describe a project you worked on and what you learned from it.'),
('behavioral', 'junior', 'Tell me about a time when you had to work with a difficult team member.'),
('behavioral', 'mid', 'Describe a situation where you had to make a technical decision under pressure.'),
('behavioral', 'mid', 'Tell me about a time when you had to debug a complex issue. How did you approach it?'),
('behavioral', 'mid', 'Describe a time when you had to explain a technical concept to a non-technical person.'),
('behavioral', 'mid', 'Tell me about a project where you had to balance multiple priorities.'),
('behavioral', 'mid', 'Describe a time when you received negative feedback. How did you handle it?'),
('behavioral', 'senior', 'Tell me about a time when you had to lead a technical initiative.'),
('behavioral', 'senior', 'Describe a situation where you had to make a trade-off between technical debt and feature delivery.'),
('behavioral', 'senior', 'Tell me about a time when you had to mentor a junior developer.'),
('behavioral', 'senior', 'Describe a time when you had to advocate for a technical decision to stakeholders.'),

-- System design prompts
('system_design', 'mid', 'Design a URL shortener like bit.ly.'),
('system_design', 'mid', 'Design a chat application like Slack.'),
('system_design', 'mid', 'Design a notification system.'),
('system_design', 'mid', 'Design a file storage system like Dropbox.'),
('system_design', 'senior', 'Design a distributed cache system.'),
('system_design', 'senior', 'Design a social media feed system.'),
('system_design', 'senior', 'Design a video streaming platform like YouTube.'),
('system_design', 'senior', 'Design a search engine.'),
('system_design', 'senior', 'Design a payment processing system.'),
('system_design', 'senior', 'Design a real-time analytics system.'),

-- Coding prompts
('coding', 'junior', 'Write a function to reverse a string.'),
('coding', 'junior', 'Write a function to check if a string is a palindrome.'),
('coding', 'junior', 'Write a function to find the maximum number in an array.'),
('coding', 'junior', 'Write a function to remove duplicates from an array.'),
('coding', 'mid', 'Implement a function to merge two sorted arrays.'),
('coding', 'mid', 'Write a function to validate a binary search tree.'),
('coding', 'mid', 'Implement a debounce function.'),
('coding', 'mid', 'Write a function to flatten a nested object.'),
('coding', 'senior', 'Implement a LRU cache.'),
('coding', 'senior', 'Design and implement a rate limiter.'),
('coding', 'senior', 'Implement a task scheduler with priority queue.'),

-- General prompts
('general', 'junior', 'What interests you most about software development?'),
('general', 'junior', 'How do you stay updated with the latest technologies?'),
('general', 'mid', 'What is your approach to code review?'),
('general', 'mid', 'How do you prioritize tasks when working on multiple projects?'),
('general', 'senior', 'How do you approach technical architecture decisions?'),
('general', 'senior', 'What is your philosophy on technical debt?');

