const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const myMailer = require("../utils/mailer");

async function signupController(req, res) {
  const { userName, email, password } = req.body;
  try {
    const user = await signUp(userName, email, password);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
async function autoLoginController(req, res) {
  try {
    const user = req.user || req.session.user;

    if (!user) {
      res.json({
        success: false,
        userInfo: null,
      });
    } else {
      res.json({
        success: true,
        userInfo: {
          userId: user.id,
          userName: user.userName,
          email: user.email,
          avatar: user.avatar,
          isOauth: user.isOauth,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
async function LogOutController(req, res) {
  try {
    req.session.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;
  try {
    const { userInfo } = await login(email, password);
    req.session.user = userInfo;
    res.json({ success: true, userInfo });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

const verify = async (req, res, next) => {
  try {
    const hashedUserName = req.query.token;
    const { email } = await jwt.verify(
      hashedUserName,
      process.env.TOKEN_PRIVATE_KEY
    );

    if (email) {
      await prisma.user.update({
        where: { email: email },
        data: { isVerify: true },
      });
      res.status(200).json({ message: "Xác thực Email thành công", ok: true });
    } else {
      const error = new Error("Hệ thống không xác thực được email này !");
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
async function changePasswordController(req, res) {
  const { oldPassword, newPassword } = req.body;
  const userSession = req.user || req.session.user;
  console.log(req.body, userSession.userId);
  try {
    await changePassword(oldPassword, newPassword, userSession.userId);
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

const defaultAvatar =
  "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg";
async function signUp(userName, email, password, avatar = defaultAvatar) {
  const hashedPassword = await bcrypt.hash(password, 10);
  if (await prisma.user.findFirst({ where: { email } })) {
    throw new Error("Email already used !");
  }
  const user = await prisma.user.create({
    data: {
      userName,
      email,
      password: hashedPassword,
      avatar,
    },
  });
  const hashedUserName = await jwt.sign(
    {
      email,
      userName,
    },
    process.env.TOKEN_PRIVATE_KEY,
    { expiresIn: "8h" }
  );
  myMailer(
    email,
    "ClassRoom email verification",
    `<h2>Xin vui lòng click vào <a href="${process.env.BACKEND_URL}/user/auth/verify?&token=${hashedUserName}">đường link này</a> để xác thực mail của bạn</h2>
    `
  );
  return user;
}

async function login(email, password) {
  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log(user);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.isVerify) {
    throw new Error("Account need to be verified");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const userInfo = {
    userId: user.id,
    userName: user.userName,
    email: user.email,
    avatar: user.avatar,
    isOauth: user.isOauth,
  };
  return { userInfo };
}

async function changePassword(oldPassword, newPassword, userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("Cant not indentify your account");
  }
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    throw new Error("Wrong old password !");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

async function changeForgotPassword(newPassword, userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("Cant not indentify your account");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

async function sendEmailChangePasswordController(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("Email is not registered !");
    }
    if (user.isOauth) {
      throw new Error("Email is provided by other service !");
    }
    const token = await jwt.sign(
      {
        email,
      },
      process.env.TOKEN_PRIVATE_KEY,
      { expiresIn: "8h" }
    );
    myMailer(
      email,
      "ClassRoom change your password",
      `<h2>Xin vui lòng click vào <a href="${process.env.FRONTEND_URL}/emailChangePassword/${token}">đường link này</a> để đổi mật khẩu của bạn</h2>
      <p>Đường link trên sẽ hết hạn sau 8 giờ kể từ khi gửi</p>
      `
    );
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function changePasswordEmailController(req, res) {
  const { newPassword } = req.body;
  const emailToken = req.params.emailToken;
  try {
    const { email } = await jwt.verify(
      emailToken,
      process.env.TOKEN_PRIVATE_KEY
    );
    console.log(emailToken, email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    await changeForgotPassword(newPassword, user.id);
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  signupController,
  loginController,
  autoLoginController,
  LogOutController,
  changePasswordController,
  changePasswordEmailController,
  verify,
  signUp,
  sendEmailChangePasswordController,
};
