const prisma = require('../db/prisma');

async function findAll() {
  return prisma.tag.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  return prisma.tag.findUnique({ where: { id: Number(id) } });
}

async function create(fields = {}) {
  return prisma.tag.create({
    data: {
      name: fields.name,
    },
  });
}

async function update(id, patch = {}) {
  const data = {};

  if (patch.name !== undefined) data.name = patch.name;

  if (Object.keys(data).length === 0) {
    return findById(id);
  }

  try {
    return await prisma.tag.update({
      where: { id: Number(id) },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

async function remove(id) {
  try {
    await prisma.tag.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };
