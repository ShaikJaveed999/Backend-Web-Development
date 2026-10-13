const prisma = require('../db/prisma');

async function findAll() {
  return prisma.vote.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  return prisma.vote.findUnique({ where: { id: Number(id) } });
}

async function create(fields = {}) {
  return prisma.vote.create({
    data: {
      userId: Number(fields.userId),
      postId: Number(fields.postId),
    },
  });
}

async function update(id, patch = {}) {
  const data = {};

  if (patch.userId !== undefined) data.userId = Number(patch.userId);
  if (patch.postId !== undefined) data.postId = Number(patch.postId);

  if (Object.keys(data).length === 0) {
    return findById(id);
  }

  try {
    return await prisma.vote.update({
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
    await prisma.vote.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };
