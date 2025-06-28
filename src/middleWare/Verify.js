import jwt from 'jsonwebtoken';

const VerifyAuth = (req, res, next) => {
  // Đọc token từ cookie (đảm bảo đã dùng cookie-parser)
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Gắn thông tin user vào req
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

export default VerifyAuth;