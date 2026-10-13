const test = require('node:test');
const assert = require('node:assert/strict');

function loadServiceWithMock(repository) {
  const repoPath = require.resolve('../src/repositories/postRepository');
  const servicePath = require.resolve('../src/services/postService');
  const previousRepository = require.cache[repoPath];
  const previousService = require.cache[servicePath];

  require.cache[repoPath] = { exports: repository };
  delete require.cache[servicePath];

  const service = require('../src/services/postService');

  return {
    service,
    restore() {
      if (previousRepository) {
        require.cache[repoPath] = previousRepository;
      } else {
        delete require.cache[repoPath];
      }

      if (previousService) {
        require.cache[servicePath] = previousService;
      } else {
        delete require.cache[servicePath];
      }
    },
  };
}

test('createPost validates required title', async () => {
  const { service, restore } = loadServiceWithMock({
    create: async () => {
      throw new Error('repository should not have been called');
    },
  });

  try {
    await assert.rejects(
      () => service.createPost({ body: 'Content only' }),
      (error) => error instanceof Error && error.statusCode === 422 && error.message === 'Title is required',
    );
  } finally {
    restore();
  }
});

test('createPost trims input and forwards the repository payload', async () => {
  const expected = { title: 'Updated title', body: 'Body', authorId: 2 };
  const { service, restore } = loadServiceWithMock({
    create: async (payload) => {
      assert.deepEqual(payload, expected);
      return { ...payload, id: 7 };
    },
  });

  try {
    const result = await service.createPost({ title: '  Updated title  ', body: 'Body', authorId: 2 });
    assert.deepEqual(result, { ...expected, id: 7 });
  } finally {
    restore();
  }
});

test('normalizePrismaError maps duplicate-key errors to 409', () => {
  const { normalizePrismaError } = require('../src/utils/errors');
  const error = { code: 'P2002' };
  const result = normalizePrismaError(error);

  assert.equal(result.statusCode, 409);
  assert.equal(result.message, 'A record with the same unique value already exists.');
});
