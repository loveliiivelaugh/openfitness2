CREATE TABLE
public.chats (
    id serial NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    messages json NULL,
    session_name text NULL,
    user_id uuid NULL,
    session_id uuid NULL
);

ALTER TABLE
  public.chats
ADD
  CONSTRAINT chats_pkey PRIMARY KEY (id)