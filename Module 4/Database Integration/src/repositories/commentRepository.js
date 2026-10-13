const prisma = require('../db/prisma');

async function findAll() {
  return prisma.comment.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  return prisma.comment.findUnique({ where: { id: Number(id) } });
}

async function create(fields = {}) {
  return prisma.comment.create({
    data: {
      body: fields.body ?? '',
      authorId: Number(fields.authorId),
      postId: Number(fields.postId),
    },
  });
}

async function update(id, patch = {}) {
  const data = {};

  if (patch.body !== undefined) data.body = patch.body;
  if (patch.authorId !== undefined) data.authorId = Number(patch.authorId);
  if (patch.postId !== undefined) data.postId = Number(patch.postId);

  if (Object.keys(data).length === 0) {
    return findById(id);
  }

  try {
    return await prisma.comment.update({
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
    await prisma.comment.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };
