CREATE TABLE public.tables (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    table_number INTEGER NOT NULL,
    seat_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active_orders INTEGER DEFAULT 0,
    order_history JSONB DEFAULT '[]'::JSONB
) TABLESPACE pg_default;
