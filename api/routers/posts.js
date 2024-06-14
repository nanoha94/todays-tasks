const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { comment, tasks, category, numOfGood, authorId } = req.body;

  const data_tasks = tasks.map((task) => {
    return { content: task.content, completed: task.completed };
  });

  const data = {
    comment,
    tasks: {
      createMany: {
        data: data_tasks,
      },
    },
    category,
    numOfGood,
    authorId,
  };

  try {
    const newPost = await prisma.post.create({
      data,
      include: { tasks: true, author: true },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです" });
  }
});

router.get("/", async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      include: { tasks: true, author: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(201).json(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです" });
  }
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { tasks: true },
    });
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです" });
  }
});

router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { comment, tasks, category, numOfGood, authorId } = req.body;

  const data = {
    comment,
    tasks: {
      set: tasks,
    },
    category,
    numOfGood,
    authorId,
  };

  try {
    const updatedPost = await prisma.post.update({
      data,
      where: { id: postId },
      include: { tasks: true, author: true },
    });
    res.status(201).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです" });
  }
});

module.exports = router;
