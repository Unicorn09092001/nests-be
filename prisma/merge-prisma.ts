import fs from 'fs';
import path from 'path';

const base = fs.readFileSync('prisma/base.prisma', 'utf-8');
const schemasDir = 'prisma/schemas';

const files = fs.readdirSync(schemasDir);

const models = files
  .map(file => fs.readFileSync(path.join(schemasDir, file), 'utf-8'))
  .join('\n\n');

fs.writeFileSync('prisma/schema.prisma', base + '\n\n' + models);