import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {

  const admin = await prisma.admin.findFirst();
  if (admin) {
    console.log("Admin already exists");
  } else {
    await prisma.admin.create({
      data: {
        username: "admin",
        password: await bcrypt.hash("admin2024!@", 10),
      },
    });
  }

  const school = await prisma.school.findFirst();
  if (school) {
    console.log("School already exists");
  } else {
    await prisma.school.createMany({
      data: [
        {
          name: "경북대학교",
        },
        {
          name: "경북대학교1",
        },
        {
          name: "경북대학교2",
        },
        {
          name: "경북대학교3",
        },
        {
          name: "경북대학교4",
        },
      ],
    });
  }

  const student = await prisma.student.findFirst();
  if (student) {
    console.log("Student already exists");
  } else {
    await prisma.student.create({
      data: {
        name: "김주형",
        username: "kbuddies",
        phone: "010-1234-5678",
        email: "kbuddies.duke@gmail.com",
        password: await bcrypt.hash("gen2kbgroup@", 10),
        schoolId: (await prisma.school.findFirst())?.id as string,
      },
    });
  }

  const schoolUser = await prisma.schoolUser.findFirst();
  if (schoolUser) {
    console.log("SchoolUser already exists");
  } else {
    await prisma.schoolUser.create({
      data: {
        name: "김주형",
        username: "kbuddies",
        email: "kbuddies.duke@gmail.com",
        password: await bcrypt.hash("gen2kbgroup@", 10),
        phone: "010-1234-5678",
        schoolId: (await prisma.school.findFirst())?.id as string,
      },
    });
  }


}

main()
  .then(async () => {
    console.log("Seeded");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });