import { mockUserData, setupMockUser, userSignIn } from '../../test/utils';

describe('POST /api/users/signin', () => {
  // ----------------------
  // SUCCESSFUL REQUESTS
  it('returns status 200 on successful signin', async () => {
    await setupMockUser();

    const response = await userSignIn(
      mockUserData.email,
      mockUserData.password
    );

    expect(response.status).toEqual(200);
  });

  it('sets a cookie on successful signin', async () => {
    await setupMockUser();

    const response = await userSignIn(
      mockUserData.email,
      mockUserData.password
    );

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  // ---------------------
  // FAILED REQUESTS
  it('returns status 400 if email or password is invalid', async () => {
    await setupMockUser();

    // Test invalid email
    const invalidEmailRes = await userSignIn(
      'notexist@test.com',
      mockUserData.password
    );
    expect(invalidEmailRes.status).toEqual(400);

    // Test invalid password
    const invalidPasswordRes = await userSignIn(mockUserData.email, 'sdvasdv');
    expect(invalidPasswordRes.status).toEqual(400);
  });
});
