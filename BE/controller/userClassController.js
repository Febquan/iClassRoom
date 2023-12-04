const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const myMailer = require("../utils/mailer");

async function createClass(req, res) {
  const { className, role, studentId, userId } = req.body;
  try {
    const theClass = await prisma.class.create({
      data: {
        className: className,
        createBy: userId,
        haveStudent: {
          create: {
            userId: userId,
            role: role,
            organizeId: studentId,
          },
        },
      },
    });
    console.log(theClass);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getAllUserClass(req, res) {
  try {
    const userId = req.params.userId;
    const classes = await prisma.userClass.findMany({
      where: {
        userId: userId,
      },
      include: {
        class: {
          include: {
            haveStudent: {
              include: {
                student: {
                  select: {
                    userName: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json({ success: true, classes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getStudentInviteLink(req, res) {
  try {
    const { classId } = req.params;
    const hashedClassIdAndRole = await jwt.sign(
      {
        classId,
        role: "student",
      },
      process.env.TOKEN_PRIVATE_KEY,
      { expiresIn: "2h" }
    );
    res.json({
      success: true,
      link: `${process.env.FRONTEND_URL}/classes/acceptinvite/${hashedClassIdAndRole}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
async function getTeacherInviteLink(req, res) {
  try {
    const { classId } = req.params;
    const hashedClassIdAndRole = await jwt.sign(
      {
        classId,
        role: "teacher",
      },
      process.env.TOKEN_PRIVATE_KEY,
      { expiresIn: "2h" }
    );
    res.json({
      success: true,
      link: `${process.env.FRONTEND_URL}/classes/acceptinvite/${hashedClassIdAndRole}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function acceptInvite(req, res) {
  try {
    const { hashedClassId, userId } = req.body;
    const { classId, role } = await jwt.verify(
      hashedClassId,
      process.env.TOKEN_PRIVATE_KEY
    );
    console.log(userId, classId);
    await prisma.userClass.create({
      data: {
        userId: userId,
        courseId: classId,
        role: role,
      },
    });

    res.json({
      success: true,
      link: `${process.env.BACKEND_URL}/user/class/invitelink/${hashedClassId}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getClassInviteInfo(req, res) {
  try {
    const hashedClassId = req.params.hashedClassId;
    const { classId, role } = await jwt.verify(
      hashedClassId,
      process.env.TOKEN_PRIVATE_KEY
    );
    let inviteClass = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        haveStudent: true,
      },
    });
    inviteClass = { role, ...inviteClass };

    res.json({ success: true, class: inviteClass });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getClassPost(req, res) {
  try {
    const classId = req.params.classId;

    let classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        haveStudent: true,
        post: {
          include: {
            comments: true,
          },
        },
      },
    });
    res.json({ success: true, classInfo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
module.exports = {
  createClass,
  getAllUserClass,
  getStudentInviteLink,
  getTeacherInviteLink,
  acceptInvite,
  getClassInviteInfo,
  getClassPost,
};
