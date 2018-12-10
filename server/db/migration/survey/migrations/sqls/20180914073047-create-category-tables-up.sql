CREATE TABLE
  category
(
  id          bigserial NOT NULL,
  uuid        uuid      NOT NULL DEFAULT uuid_generate_v4(),
  props       jsonb              DEFAULT '{}'::jsonb,
  props_draft jsonb              DEFAULT '{}'::jsonb,

  PRIMARY KEY (id),
  CONSTRAINT category_uuid_idx UNIQUE (uuid)
);

CREATE TABLE
  category_level
(
  id            bigserial NOT NULL,
  uuid          uuid      NOT NULL DEFAULT uuid_generate_v4(),
  category_uuid uuid      NOT NULL,
  index         integer   NOT NULL,
  props         jsonb              DEFAULT '{}'::jsonb,
  props_draft   jsonb              DEFAULT '{}'::jsonb,

  PRIMARY KEY (id),
  CONSTRAINT category_level_uuid_idx UNIQUE (uuid),
  CONSTRAINT category_level_category_fk FOREIGN KEY (category_uuid) REFERENCES category (uuid) ON DELETE CASCADE
);

CREATE TABLE
  category_item
(
  id          bigserial NOT NULL,
  uuid        uuid      NOT NULL DEFAULT uuid_generate_v4(),
  level_uuid  uuid      NOT NULL,
  parent_uuid uuid,
  props       jsonb              DEFAULT '{}'::jsonb,
  props_draft jsonb              DEFAULT '{}'::jsonb,

  PRIMARY KEY (id),
  CONSTRAINT category_item_uuid_idx UNIQUE (uuid),
  CONSTRAINT category_item_level_fk FOREIGN KEY (level_uuid) REFERENCES category_level (uuid) ON DELETE CASCADE,
  CONSTRAINT category_item_parent_fk FOREIGN KEY (parent_uuid) REFERENCES category_item (uuid) ON DELETE CASCADE
);