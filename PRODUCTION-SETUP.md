# Production Database Setup Instructions

## Automatic Setup (When You Republish)

✅ **Categories will be added automatically!**

When you republish the application, the production server will automatically:
- Seed **7 package categories** (New Year, Corporate, Eco, etc.)
- Create necessary database tables
- Apply all schema migrations

## Manual Setup Required: Admin User

⚠️ **For security reasons, admin user is NOT created automatically.**

### How to Create Admin User Securely:

**Option 1: Through Replit Database UI** (Recommended)

1. Open: **Database tab → Production Database → My Data**
2. Find the **users** table
3. Click **"Add Row"** or **"+"** button
4. Fill in:
   - **id**: Generate a UUID (use https://www.uuidgenerator.net/)
   - **username**: `admin` (or your choice)
   - **password**: Use bcrypt hash of YOUR chosen password

**To generate bcrypt hash:**
```bash
# Run this in your terminal (replace YOUR_PASSWORD):
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('brainBrainpromo2025.', 10).then(h => console.log(h));"
```

**Option 2: Through Development Database (Copy Method)**

1. In **Development** environment, create admin user through your application
2. Copy the user record from Development → Production database
3. Manually update the password through Production database UI

---

## Security Best Practices

🔐 **NEVER use default passwords like "admin123"**

✅ **DO:**
- Use strong, unique passwords (15+ characters)
- Change passwords regularly
- Use a password manager

❌ **DON'T:**
- Commit passwords or password hashes to git
- Use the same password across environments
- Share admin credentials

---

## Verification Steps

After republishing and creating admin user:

1. ✅ Visit https://promopaketi.com
2. ✅ Check dropdown menu shows categories
3. ✅ Try admin login with your credentials
4. ✅ Verify admin panel loads

---

## Troubleshooting

**Categories not showing?**
- Check deployment logs for migration errors
- Verify production database has `package_categories` table
- Check that categories were seeded (7 rows expected)

**Can't login as admin?**
- Verify admin user exists in production `users` table
- Check password hash is correct bcrypt format
- Try resetting password through database UI

**Need help?**
- Contact Replit Support
- Check deployment logs for errors
- Verify DATABASE_URL is set correctly
