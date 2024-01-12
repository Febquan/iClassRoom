const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function getAllUser(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function deleteUser(req, res) {
  const { userId } = req.body;
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

async function lockUser(req, res) {
  const { userId, isLock } = req.body;
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isLock: isLock,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllUser,
  deleteUser,
  lockUser,
};
