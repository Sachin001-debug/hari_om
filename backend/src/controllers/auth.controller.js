const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { setAuthCookies, clearAuthCookies } = require('../services/token.service');

const setNoCache = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

const login = asyncHandler(async (req, res) => {
  setNoCache(res);
  const { email, password } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';

  const { admin, accessToken, rawRefreshToken } = await authService.login({
    email,
    password,
    ipAddress,
    userAgent
  });

  setAuthCookies(res, accessToken, rawRefreshToken);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    admin
  });
});

const refresh = asyncHandler(async (req, res) => {
  setNoCache(res);
  const rawRefreshToken = req.cookies?.refresh_token;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';

  try {
    const { admin, accessToken, rawRefreshToken: newRawRefreshToken } = await authService.refreshSession({
      rawRefreshToken,
      ipAddress,
      userAgent
    });

    setAuthCookies(res, accessToken, newRawRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Session refreshed successfully',
      admin
    });
  } catch (err) {
    // If refresh fails for any reason, wipe cookies clean
    clearAuthCookies(res);
    throw err;
  }
});

const logout = asyncHandler(async (req, res) => {
  setNoCache(res);
  const rawRefreshToken = req.cookies?.refresh_token;

  await authService.logout(rawRefreshToken);
  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

const getMe = asyncHandler(async (req, res) => {
  setNoCache(res);
  const admin = await authService.getMe(req.admin.id);

  return res.status(200).json({
    success: true,
    admin
  });
});

module.exports = {
  login,
  refresh,
  logout,
  getMe
};

