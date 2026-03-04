CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO todos (title, completed) VALUES
    ('Apprendre Docker', true),
    ('Créer un docker-compose.yml', false),
    ('Pousser les images sur Docker Hub', false);
