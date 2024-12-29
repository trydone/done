CREATE DATABASE done;

CREATE DATABASE done_cvr;

CREATE DATABASE done_cdb;

\c zstart;

CREATE TABLE "user" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
);
