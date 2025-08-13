import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const login = 'aprovame';
  const password = 'aprovame';

  const exists = await prisma.user.findUnique({ where: { login } });
  if (!exists) {
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        login,
        password: hash,
        role: 'admin',
      },
    });
    console.log('Usuário seed criado:', login);
  } else {
    console.log('Usuário já existe:', login);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
