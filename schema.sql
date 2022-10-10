CREATE TABLE IF NOT EXISTS config (
  network   varchar(100) primary key,
  config    json,
  storage   json
);

CREATE TABLE IF NOT EXISTS collections (
  address    varchar(100) primary key,
  name       varchar(100),
  lore       text,
  crest      varchar(200),
  banner     varchar(200),
  link       varchar(200),
  sort_order integer default 100 
);

CREATE TABLE IF NOT EXISTS heroes (
  token_id         integer,
  token_address    varchar(200),
  token_owner      varchar(200),
  hero_owner       varchar(200),
  hero_hash        varchar(200),
  name             varchar(200),
  hero             json,
  token_metadata   json,
  summoned_at      timestamp,
  strength         integer,
  health           integer,
  experience       integer,
  experience_total integer,
  wins             integer,
  losses           integer,
  token_synced_at  timestamp,
  hero_synced_at   timestamp,
  primary key(token_id, token_address)
);

CREATE TABLE IF NOT EXISTS battles (
  bid                       varchar(100),
  challenger_owner          varchar(200),
  challenger_token_id       varchar(200),
  challenger_token_address  varchar(200),
  challenged_owner          varchar(200),
  challenged_token_id       varchar(200),
  challenged_token_address  varchar(200),
  challenge_time            timestamp,
  finish_time               timestamp,
  start_time                timestamp,
  loot                      integer,
  hash                      varchar(200),
  battle                    json,
  synced_at                 timestamp,
  cancelled                 boolean default false,
  resolved                  boolean default false,
  notified                  boolean default false,
  primary key(bid)
);
