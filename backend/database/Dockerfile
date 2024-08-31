FROM postgres:alpine

# Runs after the base image has been created ...
# ... to seed the database with any sql files in /docker-entrypoint-initdb.d
ADD /postgres/migrations/*.sql /docker-entrypoint-initdb.d

RUN chmod a+r /docker-entrypoint-initdb.d/*
