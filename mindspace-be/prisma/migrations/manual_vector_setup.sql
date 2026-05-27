CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE memory_chunks ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE entities      ADD COLUMN IF NOT EXISTS embedding vector(768);

CREATE INDEX IF NOT EXISTS memory_chunks_embedding_hnsw
  ON memory_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS entities_embedding_hnsw
  ON entities USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

ALTER TABLE memories
  ADD COLUMN IF NOT EXISTS content_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED;

CREATE INDEX IF NOT EXISTS memories_content_fts
  ON memories USING gin(content_tsv);

CREATE INDEX IF NOT EXISTS memories_content_trgm
  ON memories USING gin(content gin_trgm_ops);
