# Security Guidelines for MR & FT

## Environment Variables & Credentials

### ✅ What's Fixed
- ✓ `.env` is properly in `.gitignore` - credentials are never committed to Git
- ✓ `.env.example` has been created with placeholder values
- ✓ Server no longer logs sensitive env var details
- ✓ `.env` file was never committed to version control history

### 🔒 Important Security Rules

#### 1. **Never Commit .env Files**
```bash
# ✅ CORRECT - .env is ignored by Git
.env            # This file is never committed
.env.example    # This file IS committed with placeholders
```

#### 2. **Handle Credentials Safely**

**Backend (.env file):**
- `MONGODB_URI` - Keep database credentials secure
- `JWT_SECRET` - Use a long, random string (minimum 32 characters)
- `OPENAI_API_KEY` - Never share or log this key
- `EMAIL_PASSWORD` - Use app-specific passwords, not main account password
- `HuggingFace_API_KEY` - Keep hidden from logs

**Frontend (.env file):**
- `EXPO_PUBLIC_*` - These ARE public (visible in client code)
- `EXPO_PUBLIC_API_BASE_URL` - Safe to expose
- `EXPO_PUBLIC_FIREBASE_API_KEY` - Safe to expose (Firebase API key ≠ credentials)
- Avoid putting secrets here - use backend APIs instead

#### 3. **Setup Instructions for New Developers**

```bash
# 1. Clone the repository
git clone <repo-url>
cd mr-ft

# 2. Backend setup
cd backend
cp .env.example .env
# Edit .env with your actual credentials

# 3. Frontend setup  
cd ../frontend
cp .env.example .env
# Edit .env with project-specific URLs

# 4. Install dependencies and run
npm install
npm start
```

### 🚨 If Credentials Are Compromised

If any credentials from `.env` are exposed:

1. **MongoDB**: Reset password in MongoDB Atlas
2. **JWT Secrets**: Rotate them (existing tokens will be invalid)
3. **OpenAI API Key**: Rotate in OpenAI dashboard & create new key
4. **Gmail App Password**: Delete and create new app-specific password
5. **HuggingFace Token**: Regenerate in account settings

### 📋 Checklist Before Deployment

- [ ] All sensitive values are in `.env` (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` is updated with placeholders
- [ ] No credentials in commit messages or PR descriptions
- [ ] All API keys are unique to environment (dev/staging/prod)
- [ ] Server does not log sensitive environment variables
- [ ] Frontend only uses `EXPO_PUBLIC_*` for public data

### 🔍 Verification Commands

```bash
# Check if .env is in .gitignore
grep "\.env" .gitignore

# Verify .env was never committed
git log --all --full-history -- backend/.env
git log --all --full-history -- frontend/.env

# Search for any hardcoded secrets in code
git log -p -S "sk-proj-" -- *.js *.jsx  # Look for API keys
```

### 📚 References
- [Environment Variables Best Practices](https://12factor.net/config)
- [Node.js dotenv](https://github.com/motdotla/dotenv)
- [Expo Environment Variables](https://docs.expo.dev/build-reference/variables/)
