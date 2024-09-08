CREATE TABLE public.bug_report (
    id BIGSERIAL PRIMARY KEY,        -- Auto-incrementing primary key
    name TEXT NOT NULL,              -- Name of the bug reporter, required
    message TEXT NOT NULL,           -- Message describing the bug, required
    severity TEXT                    -- Optional severity level of the bug
);
