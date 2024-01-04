const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const myMailer = require("../utils/mailer");
const {
  uploadFile,
  getFileStream,
  getS3PresignedUrl,
  s3DeleteFiles,
} = require("./../utils/s3");
const { deleteFile } = require("./../utils/fileManager");
const { MulterError } = require("multer");
const upload = require("../utils/upload");
const { promises } = require("nodemailer/lib/xoauth2");

const { nanoid } = require("nanoid");
console.log(nanoid(11));
function HandleMulterError(req, res, next) {
  upload.array("files")(req, res, (err) => {
    if (err instanceof MulterError) {
      return res.status(400).send("File size limit exceeded");
    } else if (err) {
      console.error(err);
      return res.status(500).send("Internal server error.");
    }

    next();
  });
}
async function checkIsInClass(req, res, next) {
  const user = req.user || req.session.user;
  const { classId } = req.params.classId || req.body.classId;
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

  if (enroll.role != "teacher") {
    const error = new Error("User are not teacher of this class");
    error.statusCode = 401;
    return next(error);
  }
  next();
}

async function checkIsStudent(req, res, next) {
  const user = req.user || req.session.user;
  const classId = req.params.classId || req.body.classId;
  const enroll = await prisma.userClass.findFirst({
    where: {
      userId: user.id,
      courseId: classId,
    },
  });

  if (enroll.role != "student") {
    const error = new Error("User are not student of this class");
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

    const fileKeys = await uploadAndGetFileKey(req.files);
    console.log(fileKeys);
    await prisma.post.create({
      data: {
        title,
        content: description,
        published: true,
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
        joinCodeStudent: nanoid(11),
        joinCodeTeacher: nanoid(11),
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

async function joinByCode(req, res) {
  try {
    const { code, userId } = req.body;
    let classInfo = await prisma.class.findFirst({
      where: {
        OR: [{ joinCodeStudent: code }, { joinCodeTeacher: code }],
      },
    });
    if (!classInfo) {
      throw new Error("Invalid Code");
    }
    let joinInfo = await prisma.userClass.findFirst({
      where: {
        userId: userId,
        courseId: classInfo.id,
      },
    });
    if (joinInfo) {
      throw new Error("You are already in this class");
    }
    let role = classInfo.joinCodeStudent == code ? "student" : "teacher";

    await joinClass(role, userId, classInfo.id, "");

    res.json({
      success: true,
      code: classInfo.joinCodeStudent,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
async function getStudentInviteCode(req, res) {
  try {
    const { classId } = req.params;
    let classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      select: {
        joinCodeStudent: true,
      },
    });
    res.json({
      success: true,
      code: classInfo.joinCodeStudent,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getTeacherInviteCode(req, res) {
  try {
    const { classId } = req.params;
    let classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      select: {
        joinCodeTeacher: true,
      },
    });
    res.json({
      success: true,
      code: classInfo.joinCodeTeacher,
    });
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
    await joinClass(role, userId, classId, studentClassId);
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function joinClass(role, userId, classId, studentClassId) {
  if (role == "teacher") {
    await prisma.userClass.create({
      data: {
        userId: userId,
        courseId: classId,
        role: role,
        organizeId: studentClassId,
      },
    });
  }
  if (role == "student") {
    await prisma.$transaction(async (tx) => {
      const classTests = await tx.gradePart.findMany({
        where: {
          classID: classId,
        },
        select: {
          testid: true,
        },
      });
      const testIds = classTests
        .map((gradePart) => gradePart.testid.map((test) => test.id))
        .flat();

      await Promise.all(
        testIds.map(async (testId) => {
          return await tx.doTest.create({
            data: {
              test: {
                connect: { id: testId },
              },
              student: {
                connect: { id: userId },
              },
            },
          });
        })
      );
      await Promise.all(
        testIds.map(async (testId) => {
          const content = await tx.privateTestPostContent.findUnique({
            where: {
              testId: testId,
            },
          });
          return await tx.PrivateTestPostReceiver.create({
            data: {
              content: {
                connect: { id: content.id },
              },
              receiver: {
                connect: { id: userId },
              },
            },
          });
        })
      );
      await tx.userClass.create({
        data: {
          userId: userId,
          courseId: classId,
          role: role,
          organizeId: studentClassId,
        },
      });
    });
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

function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
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
    classInfo = exclude(classInfo, ["joinCodeStudent", "joinCodeTeacher"]);
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
  try {
    await prisma.$transaction(async (tx) => {
      const classTests = await tx.gradePart.findMany({
        where: {
          classID: classId,
        },
        select: {
          testid: true,
        },
      });
      const testIds = classTests
        .map((gradePart) => gradePart.testid.map((test) => test.id))
        .flat();
      await Promise.all(
        testIds.map(async (testId) => {
          return await tx.doTest.delete({
            where: {
              studentId_testId: {
                studentId: userId,
                testId: testId,
              },
            },
          });
        })
      );
      await tx.userClass.delete({
        where: {
          userId_courseId: { userId, courseId: classId },
        },
      });
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
                content: {
                  include: {
                    receiver: {
                      include: {
                        comments: true,
                      },
                    },
                  },
                },
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

function omit(key, obj) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

async function postUpdateGrade(req, res) {
  const { gradeParts, classId, testAndNewFile, deleteFiles } = req.body;
  const gradePartsNew = JSON.parse(gradeParts);
  const testNewFile = JSON.parse(testAndNewFile);
  const deletedFiles = JSON.parse(deleteFiles);
  const changedTestId = testNewFile.map((test) => test.testId);
  console.log(changedTestId, "-----");

  try {
    await prisma.$transaction(async (tx) => {
      // const fileKeys = uploadAndGetFileKey()

      const fileKeys = await uploadAndGetFileKey(req.files); //newfiles

      const gradePartsOld = await tx.gradePart.findMany({
        where: {
          classID: classId,
        },
        include: {
          testid: {
            include: {
              content: true,
              doTest: true,
            },
          },
        },
      });
      const oldGradePartsIds = gradePartsOld.map((gp) => gp.id);

      //get old file then delete old file then add newfiles
      const willChangedFiles = gradePartsOld
        .map((gp) => gp.testid)
        .flat()
        .filter((test) => changedTestId.includes(test.id))
        .map((test) => test.content.fileKeys)
        .flat();
      console.log(willChangedFiles);
      if (willChangedFiles.length > 0) {
        await s3DeleteFiles(willChangedFiles);
      }
      if (deletedFiles.length > 0) {
        await s3DeleteFiles(deletedFiles);
      }
      await tx.gradePart.deleteMany({
        where: {
          id: {
            in: oldGradePartsIds,
          },
        },
      });

      ///save to database
      await Promise.all(
        gradePartsNew.map(async ({ classID, ...gradePart }) => {
          return await tx.gradePart.create({
            data: {
              ...gradePart,
              class: {
                connect: {
                  id: classID,
                },
              },
              testid: {
                create: gradePart.testid.map(
                  ({ doTest, gradePartId, ...test }) => ({
                    ...test,
                    content: {
                      create: {
                        ...omit("testId", omit("classId", test.content)),
                        class: {
                          connect: {
                            id: test.content.classId,
                          },
                        },
                        fileKeys: changedTestId.includes(test.id)
                          ? [
                              ...fileKeys.filter(
                                (fileKey) => getTestIdOfFile(fileKey) == test.id
                              ),
                            ]
                          : test.content.fileKeys,
                        receiver: {
                          create: test.content.receiver.map(
                            ({ receiverId, contentId, comments, ...rv }) => ({
                              ...rv,
                              receiver: {
                                connect: {
                                  id: receiverId,
                                },
                              },
                              comments: {
                                create: comments.map(
                                  ({ id, authorId, postId, ...cm }) => ({
                                    ...cm,
                                    author: {
                                      connect: {
                                        id: authorId,
                                      },
                                    },
                                  })
                                ),
                              },
                            })
                          ),
                        },
                      },
                    },
                    doTest: {
                      create: doTest.map(({ studentId, testId, ...dot }) => ({
                        ...dot,
                        student: {
                          connect: {
                            id: studentId,
                          },
                        },
                      })),
                    },
                  })
                ),
              },
            },
          });
        })
      );
      //student in class
      const studentInClass = await tx.userClass.findMany({
        where: {
          courseId: classId,
          role: "student",
        },
      });

      const studentIdInClass = studentInClass.map((student) => student.userId);

      // notify student grade review
      const oldDoTestId = gradePartsOld
        .map((gp) =>
          gp.testid.map((test) =>
            test.doTest.map((dt) => ({
              testName: test.name,
              testId: dt.testId,
              pendingGradeReview: dt.pendingGradeReview,
              studentId: dt.studentId,
            }))
          )
        )
        .flat(2);
      const newDoTestId = gradePartsNew
        .map((gp) =>
          gp.testid.map((test) =>
            test.doTest.map((dt) => ({
              testName: test.name,
              testId: dt.testId,
              pendingGradeReview: dt.pendingGradeReview,
              studentId: dt.studentId,
            }))
          )
        )
        .flat(2);
      const changedDoTestReviewId = newDoTestId
        .map((doTestNew) => {
          const doTestOld = oldDoTestId.find(
            (doTestOld) =>
              doTestOld.testId == doTestNew.testId &&
              doTestOld.studentId == doTestNew.studentId
          );
          if (!doTestOld) return;
          return doTestOld.pendingGradeReview !==
            doTestNew.pendingGradeReview &&
            doTestNew.pendingGradeReview == false
            ? {
                name: doTestNew.testName,
                testId: doTestNew.testId,
                studentId: doTestNew.studentId,
              }
            : undefined;
        })
        .filter((el) => el !== undefined);

      const createNotiReviewPromises = [];
      for (const doTest of changedDoTestReviewId) {
        for (const studentId of studentIdInClass) {
          if (studentId != doTest.studentId) continue;
          const createNotiPromise = tx.noti.create({
            data: {
              content: `${doTest.name}: test score has just been re-evaluated !`,
              type: "gradeReview",
              target: doTest.testId + "-" + doTest.studentId,
              class: {
                connect: {
                  id: classId,
                },
              },
              user: {
                connect: {
                  id: studentId,
                },
              },
            },
          });

          createNotiReviewPromises.push(createNotiPromise);
        }
      }

      // notify student  grade final
      const oldTestIdPublic = gradePartsOld
        .map((gp) =>
          gp.testid.map((test) => ({
            name: test.name,
            id: test.id,
            isFinalize: test.isFinalize,
          }))
        )
        .flat(1);
      const newTestIdPublic = gradePartsNew
        .map((gp) =>
          gp.testid.map((test) => ({
            name: test.name,
            id: test.id,
            isFinalize: test.isFinalize,
          }))
        )
        .flat(1);
      const changedTestPublicIds = newTestIdPublic
        .map((testPubNew) => {
          const oldTest = oldTestIdPublic.find(
            (testPubOld) => testPubOld.id == testPubNew.id
          );
          if (!oldTest) return;
          return oldTest.isFinalize !== testPubNew.isFinalize &&
            testPubNew.isFinalize == true
            ? { id: testPubNew.id, name: testPubNew.name }
            : undefined;
        })
        .filter((el) => el !== undefined);

      console.log(changedTestPublicIds);

      const createNotiPublicPromises = [];

      for (const test of changedTestPublicIds) {
        for (const studentId of studentIdInClass) {
          const createNotiPromise = tx.noti.create({
            data: {
              content: `${test.name}: test results have just been officially announced !`,
              type: "finalizeGrade",
              target: test.id + "-" + studentId,
              class: {
                connect: {
                  id: classId,
                },
              },
              user: {
                connect: {
                  id: studentId,
                },
              },
            },
          });

          createNotiPublicPromises.push(createNotiPromise);
        }
      }

      await Promise.all([
        ...createNotiPublicPromises,
        ...createNotiReviewPromises,
      ]);
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getStudentGrade(req, res) {
  const { classId, userId } = req.params;
  try {
    const classRes = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        gradePart: {
          include: {
            testid: {
              include: {
                content: {
                  include: {
                    receiver: {
                      where: {
                        receiverId: userId,
                      },
                      include: {
                        comments: true,
                      },
                    },
                  },
                },
                doTest: {
                  where: {
                    studentId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    const hideFinalize = classRes.gradePart.map((classGrade) => ({
      ...classGrade,
      testid: classGrade.testid.map((test) => ({
        ...test,
        doTest: [
          {
            ...test.doTest[0],
            point: test.isFinalize ? test.doTest[0].point : null,
          },
        ],
      })),
    }));

    res.json({
      studentGrade: hideFinalize,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function submitTest(req, res) {
  const { testId } = req.body;
  const user = req.user || req.session.user;
  const studentId = user.id;
  await prisma.$transaction(async (tx) => {
    const doTestInfo = await tx.doTest.findFirst({
      where: {
        testId: testId,
      },
    });
    if (studentId !== doTestInfo.studentId) {
      throw new Error("Student credential is not valid");
    }
    if (doTestInfo) {
      const oldFileKKeys = doTestInfo.fileKeys;
      if (oldFileKKeys.length > 0) {
        await s3DeleteFiles(oldFileKKeys);
      }
    }
    const fileKeys = await uploadAndGetFileKey(req.files);
    await tx.doTest.update({
      where: {
        studentId_testId: {
          studentId: studentId,
          testId: testId,
        },
      },
      data: {
        fileKeys: fileKeys,
      },
    });
  });
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function requestGradeReview(req, res) {
  const { testId } = req.body;
  const user = req.user || req.session.user;
  const studentId = user.id;
  await prisma.doTest.update({
    where: {
      studentId_testId: {
        studentId: studentId,
        testId: testId,
      },
    },
    data: {
      pendingGradeReview: true,
    },
  });
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function postTestComment(req, res) {
  const { postId, content, classId, testName, testId } = req.body;
  const user = req.user || req.session.user;
  const authorId = user.id;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.privateCommentTest.create({
        data: {
          content,
          postComment: {
            connect: {
              id: postId,
            },
          },
          author: {
            connect: {
              id: authorId,
            },
          },
        },
      });

      const { role } = await tx.userClass.findFirst({
        where: {
          userId: authorId,
          courseId: classId,
        },
      });
      if (role == "student") {
        const teachers = await tx.userClass.findMany({
          where: {
            courseId: classId,
            role: "teacher",
          },
        });
        for (teacher of teachers) {
          await tx.noti.create({
            data: {
              content: `${testName}: New test review comment !`,
              type: "gradeReviewChat",
              target: testId + "-" + authorId,
              class: {
                connect: {
                  id: classId,
                },
              },
              user: {
                connect: {
                  id: teacher.userId,
                },
              },
            },
          });
        }
      }
      if (role == "teacher") {
        const { receiverId } = await tx.PrivateTestPostReceiver.findUnique({
          where: {
            id: postId,
          },
        });

        await tx.noti.create({
          data: {
            content: `${testName}: New test review comment !`,
            type: "gradeReviewChat",
            target: testId + "-" + receiverId,
            class: {
              connect: {
                id: classId,
              },
            },
            user: {
              connect: {
                id: receiverId,
              },
            },
          },
        });
      }
    });
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getUserNoti(req, res) {
  const user = req.user || req.session.user;
  const userId = user.id;
  const notices = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      notis: true,
    },
  });
  try {
    res.json({
      success: true,
      notice: notices.notis,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function setReadNotification(req, res) {
  const notiId = req.body.notiId;
  await prisma.noti.update({
    where: {
      id: notiId,
    },
    data: {
      isUnRead: false,
    },
  });
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function clearReadNotification(req, res) {
  const { readNotiIds } = req.body;
  await prisma.noti.deleteMany({
    where: {
      id: {
        in: readNotiIds,
      },
    },
  });
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  clearReadNotification,
  setReadNotification,
  getUserNoti,
  getStudentGrade,
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
  checkIsStudent,
  submitTest,
  requestGradeReview,
  postTestComment,
  getStudentInviteCode,
  getTeacherInviteCode,
  joinByCode,
};

//helper
const uploadAndGetFileKey = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const res = await uploadFile(file);
    deleteFile(file.path);
    return res;
  });
  const responses = await Promise.all(uploadPromises);
  const fileKeys = responses.map((uploadedFile) => {
    return uploadedFile.Key;
  });
  return fileKeys;
};

function getTestIdOfFile(filekeys) {
  const start = getPosition(filekeys, "-", 2);
  const end = getPosition(filekeys, "-", 7);
  return filekeys.substring(start + 1, end);
}
function getFileNameOfTest(filekeys) {
  const start = getPosition(filekeys, "-", 7);

  return filekeys.substring(start + 1);
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}
