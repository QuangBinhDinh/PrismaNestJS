import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

dotenv.config();

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log("📦 Seeding users...");

  try {
    // Sample users data
    const sampleUsers = [
      {
        username: "admin",
        password: "Admin@123",
        email: "admin@example.com",
        phone: "+1234567890",
        fullName: "System Administrator",
      },
      {
        username: "johndoe",
        password: "John@123",
        email: "john.doe@example.com",
        phone: "+1234567891",
        fullName: "John Doe",
      },
      {
        username: "janedoe",
        password: "Jane@123",
        email: "jane.doe@example.com",
        phone: "+1234567892",
        fullName: "Jane Doe",
      },
      {
        username: "bobsmith",
        password: "Bob@123",
        email: "bob.smith@example.com",
        phone: "+1234567893",
        fullName: "Bob Smith",
      },
      {
        username: "alicejones",
        password: "Alice@123",
        email: "alice.jones@example.com",
        phone: "+1234567894",
        fullName: "Alice Jones",
      },
      {
        username: "charliebrwn",
        password: "Charlie@123",
        email: "charlie.brown@example.com",
        phone: "+1234567895",
        fullName: "Charlie Brown",
      },
      {
        username: "dianaprince",
        password: "Diana@123",
        email: "diana.prince@example.com",
        phone: "+1234567896",
        fullName: "Diana Prince",
      },
      {
        username: "evanwilson",
        password: "Evan@123",
        email: "evan.wilson@example.com",
        phone: "+1234567897",
        fullName: "Evan Wilson",
      },
      {
        username: "fionagrey",
        password: "Fiona@123",
        email: "fiona.grey@example.com",
        phone: "+1234567898",
        fullName: "Fiona Grey",
      },
      {
        username: "georgewhite",
        password: "George@123",
        email: "george.white@example.com",
        phone: "+1234567899",
        fullName: "George White",
      },
    ];

    console.log(`  👤 Preparing to insert ${sampleUsers.length} users...`);

    // Hash passwords and insert users
    for (const userData of sampleUsers) {
      const passwordHash = await bcrypt.hash(userData.password, 12);

      await prisma.user.upsert({
        where: { username: userData.username },
        update: {},
        create: {
          username: userData.username,
          passwordHash,
          email: userData.email,
          phone: userData.phone,
          fullName: userData.fullName,
        },
      });

      console.log(`    ✅ User "${userData.username}" created`);
    }

    console.log("  ✅ Users seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
