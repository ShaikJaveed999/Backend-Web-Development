require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Ada' },
    { name: 'Grace' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { name: user.name },
      update: { name: user.name },
      create: { name: user.name },
    });
  }

  const author = await prisma.user.findUnique({ where: { name: 'Ada' } });
  const posts = [
    { title: 'First post', body: 'The contract survives storage changes.', authorId: author.id },
    { title: 'Second post', body: 'Migrations record database design.', authorId: author.id },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: {
        id: (await prisma.post.findFirst({ where: { title: post.title, authorId: post.authorId } }))?.id ?? -1,
      },
      update: { body: post.body },
      create: post,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
