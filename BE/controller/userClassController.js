const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const myMailer = require("../utils/mailer");
const {
  uploadFile,
  getFileStream,
  getS3PresignedUrl,
} = require("./../utils/s3");
const { deleteFile } = require("./../utils/fileManager");
const { MulterError } = require("multer");
const upload = require("../utils/upload");
const { promises } = require("nodemailer/lib/xoauth2");

function HandleMulterError(req, res, next) {
  upload.array("files")(req, res, (err) => {
    if (err instanceof MulterError) {
      return res.status(400).send("File size limit exceeded, 5 MB per file.");
    } else if (err) {
      console.error(err);
      return res.status(500).send("Internal server error.");
    }

    next();
  });
}
async function checkIsInClass(req, res, next) {
  const user = req.user || req.session.user;
  const { classId } = req.params;
  const enroll = await prisma.userClass.findFirst({
    where: {
      userId: user.id,
      courseId: classId,
    },
  });
  if (!enroll) {
    const error = new Error("User are not a member of this class");
    error.statusCode = 401;
    return next(error);
  }
  next();
}
async function checkIsTeacher(req, res, next) {
  const user = req.user || req.session.user;
  const classId = req.params.classId || req.body.classId;
  const enroll = await prisma.userClass.findFirst({
    where: {
      userId: user.id,
      courseId: classId,
    },
  });
  console.log(
    "------",
    req.params,
    req.body,
    classId,
    enroll,
    enroll.role,
    enroll.role != "teacher"
  );
  if (enroll.role != "teacher") {
    const error = new Error("User are not teacher of this class");
    error.statusCode = 401;
    return next(error);
  }
  next();
}
async function checkIsClassOwner(req, res, next) {
  const user = req.user || req.session.user;
  const { classId } = req.body;
  const isClassOwner = await prisma.class.findFirst({
    where: {
      id: classId,
      createBy: user.id,
    },
  });
  if (!isClassOwner) {
    const error = new Error("User is not class owner");
    error.statusCode = 401;
    return next(error);
  }
  next();
}

async function createClassPost(req, res) {
  try {
    // console.log(req.files, req.body, "alaoalaoalo");
    const { title, description, authorId, classId } = req.body;
    const uploadPromises = req.files.map(async (file) => {
      const res = await uploadFile(file);
      deleteFile(file.path);
      return res;
    });

    const responses = await Promise.all(uploadPromises);

    const fileKeys = responses.map((uploadedFile) => {
      console.log(uploadedFile.Key, "2222");
      return uploadedFile.Key;
    });
    console.log(fileKeys);
    await prisma.post.create({
      data: {
        title,
        content: description,
        published: true,
        isPrivate: false,
        fileKeys,
        author: {
          connect: {
            id: authorId,
          },
        },
        class: {
          connect: {
            id: classId,
          },
        },
      },
    });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
}
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
    console.log(error);
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
    const { hashedClassId, userId, studentClassId } = req.body;
    const { classId, role } = await jwt.verify(
      hashedClassId,
      process.env.TOKEN_PRIVATE_KEY
    );
    await prisma.userClass.create({
      data: {
        userId: userId,
        courseId: classId,
        role: role,
        organizeId: studentClassId,
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

async function getClassContent(req, res) {
  try {
    const classId = req.params.classId;

    let classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },
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
        post: {
          include: {
            comments: true,
          },
        },
      },
    });
    res.json({ success: true, classInfo });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getS3PresignedUrlControler(req, res) {
  try {
    const { fileKey } = req.body;
    const url = await getS3PresignedUrl(fileKey);
    res.json({ success: true, S3PresignedUrl: url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function inviteEmails(req, res) {
  try {
    const { emails, role, inviteUser, classId } = req.body;

    const hashedClassIdAndRole = await jwt.sign(
      {
        classId,
        role: role,
      },
      process.env.TOKEN_PRIVATE_KEY,
      { expiresIn: "2h" }
    );

    for (email of emails) {
      myMailer(
        email,
        `ClassRoom: ${inviteUser} invite you to a class`,
        `<h2>Xin vui lòng click vào <a href="${process.env.FRONTEND_URL}/classes/acceptinvite/${hashedClassIdAndRole}">đường link này</a> để tham gia lớp học</h2>
        <p>Đường link trên sẽ hết hạn sau 2 giờ kể từ khi gửi</p>
        `
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function leaveClass(req, res) {
  const { userId, classId } = req.body;
  console.log(userId, classId, "2222");
  try {
    await prisma.userClass.delete({
      where: {
        userId_courseId: { userId, courseId: classId },
      },
    });
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function changeUserRole(req, res) {
  const { changedInfo, classId } = req.body;
  console.log(changedInfo);
  try {
    for (info of changedInfo) {
      const { userId, newRole } = info;
      await prisma.userClass.update({
        where: {
          userId_courseId: { userId, courseId: classId },
        },
        data: {
          role: newRole,
        },
      });
    }
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function changeStudentId(req, res) {
  const { changedInfo, classId } = req.body;
  console.log(changedInfo);
  try {
    for (info of changedInfo) {
      const { userId, newStudentId } = info;
      await prisma.userClass.update({
        where: {
          userId_courseId: { userId, courseId: classId },
        },
        data: {
          organizeId: newStudentId,
        },
      });
    }
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function changeMyStudentId(req, res) {
  const { userId, newOrganizeId, classId } = req.body;
  try {
    let organizeIds = await prisma.userClass.findMany({
      where: {
        courseId: classId,
      },
      select: {
        organizeId: true,
      },
    });
    organizeIds = organizeIds.map((el) => el.organizeId);
    if (organizeIds.includes(newOrganizeId)) {
      throw new Error("Student id already exist");
    }
    console.log(userId, newOrganizeId, newOrganizeId, "s");
    await prisma.userClass.update({
      where: {
        userId_courseId: { userId, courseId: classId },
      },
      data: {
        organizeId: newOrganizeId,
      },
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function postComment(req, res) {
  const { postId, authorId, content } = req.body;
  console.log(postId, authorId, content);
  try {
    await prisma.comment.create({
      data: {
        authorId,
        content,
        postId,
      },
    });
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function postStudentExtraInfo(req, res) {
  const { extraInfo, classId } = req.body;
  console.log(extraInfo);
  try {
    await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        studentExtraInfo: extraInfo,
      },
    });
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getClassGrade(req, res) {
  const { classId } = req.params;
  try {
    const classGrade = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        gradePart: {
          include: {
            testid: {
              include: {
                doTest: true,
              },
            },
          },
        },
      },
    });
    res.json({
      classGrade: classGrade.gradePart,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function postUpdateGrade(req, res) {
  const { gradeParts, classId } = req.body;

  const Tests = gradeParts.map((gradePart) => gradePart.testid).flat();

  console.log("Tests", Tests);

  const doTests = Tests.map((test) => test.doTest).flat();

  console.log("doTests", doTests);

  try {
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        doTests.map(async (doTestData) => {
          console.log(doTestData.studentId, doTestData.testId, "lmao");
          await tx.doTest.update({
            where: {
              studentId_testId: {
                studentId: doTestData.studentId,
                testId: doTestData.testId,
              },
            },
            data: {
              point: doTestData.point,
              pendingGradeReview: doTestData.pendingGradeReview,
            },
          });
        })
      );

      await Promise.all(
        Tests.map(async (TestData) => {
          await tx.Test.update({
            where: {
              id: TestData.id,
            },
            data: {
              name: TestData.name,
              scale: TestData.scale,
              gradePartId: TestData.gradePartId,
              sort: TestData.sort,
              isFinalize: TestData.isFinalize,
            },
          });
        })
      );

      await Promise.all(
        gradeParts.map(async (gradePartData) => {
          await tx.gradePart.update({
            where: {
              id: gradePartData.id,
            },
            data: {
              name: gradePartData.name,
              scale: gradePartData.scale,
              sort: gradePartData.sort,
            },
          });
        })
      );
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  postUpdateGrade,
  createClass,
  getAllUserClass,
  getStudentInviteLink,
  getTeacherInviteLink,
  acceptInvite,
  getClassInviteInfo,
  getClassContent,
  createClassPost,
  HandleMulterError,
  getS3PresignedUrlControler,
  inviteEmails,
  leaveClass,
  changeUserRole,
  postComment,
  changeStudentId,
  postStudentExtraInfo,
  checkIsInClass,
  checkIsClassOwner,
  changeMyStudentId,
  getClassGrade,
  checkIsTeacher,
};
