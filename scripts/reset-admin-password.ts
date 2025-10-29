import { db } from "../server/storage";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function resetAdminPassword() {
  const newPassword = "admin123"; // Default password
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  // Update admin user password
  const result = await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.username, "admin"))
    .returning();
  
  if (result.length > 0) {
    console.log("✅ Admin password reset successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("\n⚠️  Please change this password after logging in!");
  } else {
    console.log("❌ Admin user not found. Creating new admin user...");
    
    const newUser = await db
      .insert(users)
      .values({
        username: "admin",
        password: hashedPassword,
      })
      .returning();
    
    if (newUser.length > 0) {
      console.log("✅ Admin user created successfully!");
      console.log("Username: admin");
      console.log("Password: admin123");
      console.log("\n⚠️  Please change this password after logging in!");
    }
  }
  
  process.exit(0);
}

resetAdminPassword().catch((error) => {
  console.error("Error resetting admin password:", error);
  process.exit(1);
});
