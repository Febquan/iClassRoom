const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAllClass(req, res) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        creator: {
          select: {
            avatar: true,
            email: true,
            userName: true,
          },
        },
        haveStudent: {
          include: {
            student: {
              select: {
                avatar: true,
                email: true,
                userName: true,
              },
            },
          },
        },
      },
    });

    res.json({ success: true, classes });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getSpecificClass(req, res) {
  try {
    const { classId } = req.params;
    const resClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        creator: {
          select: {
            avatar: true,
            email: true,
            userName: true,
          },
        },
        haveStudent: {
          include: {
            student: {
              select: {
                avatar: true,
                email: true,
                userName: true,
              },
            },
          },
        },
      },
    });

    res.json({ success: true, class: resClass });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function inactiveClass(req, res) {
  const { classId, active } = req.body;
  try {
    await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        isActive: active,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function deleteClass(req, res) {
  const { classId } = req.body;
  try {
    await prisma.class.delete({
      where: {
        id: classId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
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
          organizeId: "",
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

module.exports = {
  changeStudentId,
  getAllClass,
  inactiveClass,
  deleteClass,
  getSpecificClass,
  changeUserRole,
  postStudentExtraInfo,
};
