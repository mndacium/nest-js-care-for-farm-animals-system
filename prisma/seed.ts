import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const roles = {
  user: { id: 1, name: 'User' },
  admin: { id: 2, name: 'Admin' },
};

const seedRoles = async (prisma: PrismaClient) => {
  const roles = [
    { id: 1, language: 'eng', name: 'User' },
    { id: 1, language: 'ukr', name: 'Користувач' },
    { id: 2, language: 'eng', name: 'Admin' },
    { id: 2, language: 'ukr', name: 'Адміністратор' },
  ];

  return prisma.$transaction(
    roles.map((role) =>
      prisma.role.upsert({
        where: {
          id_language: {
            id: role.id,
            language: role.language,
          },
        },
        update: {},
        create: { ...role },
      }),
    ),
  );
};

const main = async () => {
  await seedRoles(prisma);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
