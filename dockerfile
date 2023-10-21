# Use the official PostgreSQL image
FROM postgres:latest

# Define environment variables for PostgreSQL configuration
ENV POSTGRES_DB SuiLa_db
ENV POSTGRES_USER test
ENV POSTGRES_PASSWORD test

# Expose the PostgreSQL port
EXPOSE 5432

# Copy the SQL files to initialize the database (optional)
# COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Start PostgreSQL when the container runs
CMD ["postgres"]
