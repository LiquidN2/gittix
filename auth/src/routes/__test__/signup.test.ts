import { userSignUp } from '../../test/utils';

describe('POST /api/users/signup', () => {
  //---------------------------
  // SUCCESSFUL REQUESTS
  it('returns status 201 on a successful signup', async () => {
    const response = await userSignUp('test@test.com', 'abcd1234');
    expect(response.status).toEqual(201);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await userSignUp('test@test.com', 'abcd1234');
    expect(response.get('Set-Cookie')).toBeDefined();
  });

  //---------------------------
  // FAILED REQUESTS
  it('returns status 400 with invalid email or password', async () => {
    // Test invalid email
    const invalidEmailRes = await userSignUp('testtest.com', 'abcd1234');
    expect(invalidEmailRes.status).toEqual(400);

    // Test invalid password
    const invalidPasswordRes = await userSignUp('test@test.com', 'pw');
    expect(invalidPasswordRes.status).toEqual(400);
  });

  it('returns status 400 with missing email or password', async () => {
    // Test missing email
    const missingEmailRes = await userSignUp(undefined, 'test');
    expect(missingEmailRes.status).toEqual(400);

    // Test missing password
    const missingPasswordRes = await userSignUp('test@test.com', undefined);
    expect(missingPasswordRes.status).toEqual(400);
  });

  it('disallows duplicate email', async () => {
    await userSignUp('test@test.com', 'abcd1234');

    const response = await userSignUp('test@test.com', 'abcd1234');
    expect(response.status).toEqual(400);
  });
});
