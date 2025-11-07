# JWT Secret Location and Information

## Where is the JWT Secret?

The JWT secret is stored in the **`.env`** file located in the `backend/` directory.

**Full path:** `/Users/chinmaydwivedi/Documents/DBMS_MINI/backend/.env`

## Current Configuration

The JWT secret is automatically generated and stored in the `.env` file:

```env
JWT_SECRET=81ab745ac056652cfdc01cfa80b577a2cca1986e9e2e16616051873440340352927086bc8af515e4dc668a90ff820f4cb722afb75e2725a6c0ac647d63c44234
```

## How It's Used

The JWT secret is used by the backend application to:
- **Sign** JWT tokens when users log in
- **Verify** JWT tokens for protected routes
- **Encode/Decode** user authentication information

## Location in Code

The JWT secret is accessed in the application through:

1. **Environment Variable**: `process.env.JWT_SECRET`
   - Loaded from `.env` file using `dotenv` package

2. **JWT Utility File**: `backend/utils/jwt.js`
   - Contains functions to generate and verify JWT tokens
   - Uses the JWT_SECRET from environment variables

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Keep the secret secure** - Don't share it publicly
3. **Use different secrets** for development and production
4. **The secret should be long and random** - Current secret is 128 characters (64 bytes in hex)

## How to Generate a New Secret

If you need to generate a new JWT secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then update the `.env` file with the new secret.

## Usage Example

```javascript
// In your backend code
import { generateToken, verifyToken } from './utils/jwt.js';

// Generate token
const token = generateToken({ userId: 1, email: 'user@example.com' });

// Verify token
const decoded = verifyToken(token);
```

## Files Using JWT Secret

- `backend/.env` - Stores the secret
- `backend/utils/jwt.js` - Uses the secret for token operations
- `backend/db.js` - Loads environment variables (including JWT_SECRET)
- `backend/server.js` - Initializes dotenv to load .env file

---

**Last Updated**: Generated automatically on first setup
**Secret Length**: 128 characters (64 bytes)
**Algorithm**: HS256 (default for jsonwebtoken)

