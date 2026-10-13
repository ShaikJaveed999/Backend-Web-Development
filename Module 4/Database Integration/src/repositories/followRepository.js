const prisma = require('../db/prisma');

async function findAll() {
  return prisma.follow.findMany({ orderBy: [{ followerId: 'asc' }, { followingId: 'asc' }] });
}

async function findById(followerId, followingId) {
  return prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: Number(followerId),
        followingId: Number(followingId),
      },
    },
  });
}

async function create(fields = {}) {
  return prisma.follow.create({
    data: {
      followerId: Number(fields.followerId),
      followingId: Number(fields.followingId),
    },
  });
}

async function update(followerId, followingId, patch = {}) {
  const data = {};

  if (patch.followerId !== undefined) data.followerId = Number(patch.followerId);
  if (patch.followingId !== undefined) data.followingId = Number(patch.followingId);

  if (Object.keys(data).length === 0) {
    return findById(followerId, followingId);
  }

  try {
    return await prisma.follow.update({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

async function remove(followerId, followingId) {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };
