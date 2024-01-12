const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const myMailer = require("../utils/mailer");

async function autoLoginController(req, res) {
  try {
    const user = req.user || req.session.user;
    if (!user) {
      res.json({
        success: false,
        userInfo: null,
      });
    } else {
      const userInfo = await prisma.admin.findFirst({
        where: {
          id: user.id,
        },
      });

      res.json({
        success: true,
        userInfo: {
          userId: userInfo.id,
          userName: userInfo.userName,
          email: userInfo.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
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
  const { userName, password } = req.body;
  console.log();
  try {
    const { userInfo } = await login(userName, password);
    const { userId, ...rest } = userInfo;
    req.session.user = {
      id: userId,
      ...rest,
    };
    res.json({ success: true, userInfo });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

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

async function login(userName, password) {
  let user = await prisma.admin.findUnique({
    where: {
      userName: userName,
    },
  });
  console.log(user);
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const userInfo = {
    userId: user.id,
    userName: user.userName,
    email: user.email,
  };
  return { userInfo };
}

async function changePassword(oldPassword, newPassword, userId) {
  const user = await prisma.admin.findUnique({
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
  await prisma.admin.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

async function changeForgotPassword(newPassword, userId) {
  const user = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("Cant not indentify your account");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({
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
    const user = await prisma.admin.findUnique({
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
      `<h2>Xin vui lòng click vào <a href="${process.env.ADMIN_FRONTEND_URL}/emailChangePassword/${token}">đường link này</a> để đổi mật khẩu của bạn</h2>
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
    const user = await prisma.admin.findUnique({
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
  loginController,
  autoLoginController,
  LogOutController,
  changePasswordController,
  changePasswordEmailController,
  sendEmailChangePasswordController,
};
