# Test Webapp for Testers

This is a test website designed for manual and API testing with intentional bugs.

## Setup

1. Ensure Docker and Docker Compose are installed.
2. Run the setup script:
   ```bash
   bash setup3.sh
   ```
3. The script will:
   - Create the project structure
   - Build and start containers
   - Initialize the database
   - Check for container errors

## Access

- **Frontend**: http://localhost:3000
- **Backend (Swagger)**: http://localhost:8000/docs
- **Adminer**: http://localhost:8080 (login: user, password: password, database: test_db)

## Intentional Bugs

### UI
- Registration form allows empty fields.
- Cart remove button does not work.
- Hidden articles are visible to unauthorized users.

### API
- `/users/{id}` returns 200 for non-existent users.
- No validation for POST requests.
- Incorrect HTTP codes (e.g., 200 instead of 404).

### Swagger
- Missing parameter descriptions.
- Incorrect endpoint documentation.

## Postman Collection
See `docs/postman_collection.json` for API testing examples.

## Testing Instructions
1. Try registering with empty fields.
2. Access non-existent user via `/users/999`.
3. Add products to cart without logging in.
4. Check hidden articles visibility.

## Notes
- Uses Bootstrap for styling.
- Setup logs are saved in `/home/user/test-webapp/setup.log`.
- Container error logs are checked automatically by the setup script.

