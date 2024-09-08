CREATE TABLE public.feature_report (
    id BIGSERIAL PRIMARY KEY,        -- Auto-incrementing primary key
    name TEXT NOT NULL,              -- Name of the feature reporter, required
    message TEXT NOT NULL,           -- Message describing the feature request, required
    urgency TEXT                     -- Optional urgency level of the feature request
);
