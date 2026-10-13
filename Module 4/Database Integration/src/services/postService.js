const postRepository = require('../repositories/postRepository');
const { AppError, normalizePrismaError } = require('../utils/errors');

async function listPosts() {
  return postRepository.findAll();
}

async function getPost(id) {
  return postRepository.findById(id);
}

async function createPost(fields) {
  if (!fields || typeof fields.title !== 'string' || fields.title.trim() === '') {
    throw new AppError('Title is required', 422);
  }

  try {
    return await postRepository.create({
      title: fields.title.trim(),
      body: typeof fields.body === 'string' ? fields.body : '',
      authorId: fields.authorId,
    });
  } catch (error) {
    throw normalizePrismaError(error);
  }
}

async function updatePost(id, patch) {
  try {
    return await postRepository.update(id, patch || {});
  } catch (error) {
    throw normalizePrismaError(error);
  }
}

async function removePost(id) {
  try {
    return await postRepository.remove(id);
  } catch (error) {
    throw normalizePrismaError(error);
  }
}

module.exports = { listPosts, getPost, createPost, updatePost, removePost };
