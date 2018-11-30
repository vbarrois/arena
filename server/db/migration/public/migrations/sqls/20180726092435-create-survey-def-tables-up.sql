CREATE TABLE
  survey
(
  id          bigserial NOT NULL,
  uuid        uuid      NOT NULL DEFAULT uuid_generate_v4(),

  published   boolean   NOT NULL DEFAULT false,
  draft       boolean   NOT NULL DEFAULT true,

  props       jsonb              DEFAULT '{}'::jsonb,
  props_draft jsonb              DEFAULT '{}'::jsonb,

  owner_id    bigint    NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE
  node_def
(
  id                   bigserial NOT NULL,
  uuid                 uuid      NOT NULL DEFAULT uuid_generate_v4(),

  survey_id            bigint    NOT NULL,
  parent_id            bigint,
  type                 varchar   NOT NULL,

  deleted              boolean   NOT NULL DEFAULT false,

  props                jsonb              DEFAULT '{}'::jsonb,
  props_draft          jsonb              DEFAULT '{}'::jsonb,

  props_advanced       jsonb              DEFAULT '{}'::jsonb,
  props_advanced_draft jsonb              DEFAULT '{}'::jsonb,

  date_created         TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),
  date_modified        TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),

  PRIMARY KEY (id)
);

ALTER TABLE
  survey
  ADD CONSTRAINT survey_user_fk
    FOREIGN KEY (owner_id)
      REFERENCES "user" ("id");

ALTER TABLE
  node_def
  ADD CONSTRAINT node_def_survey_fk
    FOREIGN KEY (survey_id)
      REFERENCES "survey" ("id")
      ON DELETE CASCADE;

ALTER TABLE
  node_def
  ADD CONSTRAINT node_def_parent_fk
    FOREIGN KEY (parent_id)
      REFERENCES "node_def" ("id")
      ON DELETE CASCADE;
