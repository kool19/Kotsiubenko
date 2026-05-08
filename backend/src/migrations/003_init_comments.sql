CREATE TABLE IF NOT EXISTS ItemComments (
  id         TEXT PRIMARY KEY,
  itemId     TEXT NOT NULL,
  authorName TEXT NOT NULL,
  body       TEXT NOT NULL,
  createdAt  TEXT NOT NULL,
  FOREIGN KEY (itemId) REFERENCES Items(id) ON DELETE CASCADE
);
