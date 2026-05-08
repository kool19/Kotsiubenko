CREATE TABLE IF NOT EXISTS Items (
  id        TEXT PRIMARY KEY,
  "user"    TEXT NOT NULL,
  severity  TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  status    TEXT NOT NULL CHECK (status IN ('Open', 'InProgress', 'Done')),
  text      TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
