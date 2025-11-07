CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_posts_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL -- Разрешаем удаление категории
);

CREATE INDEX idx_posts_title ON posts(title);
CREATE INDEX idx_posts_category_id ON posts(category_id);
