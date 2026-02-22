# 🚨 AI ASSISTANT: CRITICAL DATABASE ARCHITECTURE RULES 🚨

**READ THIS BEFORE PERFORMING ANY DATABASE OPERATIONS OR PRISMA MIGRATIONS.**

## Dual Database Architecture
This project uses a separated database schema architecture within Supabase to protect Live user data from Local development tests:
1. **Live Database (Production)**: Operates entirely within the `public` schema in PostgreSQL.
2. **Local Database (Development)**: Operates entirely within the `dev` schema in PostgreSQL.

## How the Architecture Works
- When the Next.js app runs locally (`npm run dev`), the project specifically connects to the `dev` schema (using Next.js `.env.local` settings or Supabase configurations).
- **This design is intentional.** It allows for the testing of features (like generating Dynamic Content or AI Blogs) without accidentally manipulating, overwriting, or deleting Live data.

## Checklist for Implementing New Database Features
Whenever you modify `prisma/schema.prisma` (like adding a new table, e.g., `BlogPost`):
- [ ] **Step 1:** Run standard Prisma commands (`npx prisma db push`) to push the new schema to the **Live** (`public`) database.
- [ ] **Step 2:** Ensure the exact same schema structure is explicitly created in the **Local** (`dev`) database. (If `npx prisma db push` only targets `public`, you MUST use raw SQL or temporarily switch the connection string to deploy the table to `dev`!).
- [ ] **Step 3:** Always verify that local API tests are writing strictly to `dev` and not `public`.

**⚠️ CRITICAL WARNING:** 
If the local server throws a `"dev.TableName does not exist"` error when building a feature, DO NOT manually override the `.env` URL with `?schema=public` to bypass the error. That breaks the isolation protocol! It simply means the table needs to be created in the `dev` schema independently.
