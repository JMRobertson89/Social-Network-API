const mongoose = require("mongoose");
const connection = require("../config/connection");
const { User, Thought } = require("../models");

connection.on("error", (err) => console.error(err));

connection.once("open", async () => {
  console.log("Connected to database!");

  const userCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (userCheck.length) {
    await connection.db.dropCollection("users");
  }

  const thoughtCheck = await connection.db
    .listCollections({ name: "thoughts" })
    .toArray();
  if (thoughtCheck.length) {
    await connection.db.dropCollection("thoughts");
  }

  const seedData = async () => {
    const users = await User.insertMany([
      { username: "TechNomad01", email: "technomand01@example.com" },
      { username: "CodeExplorer", email: "codeexplorer@example.com" },
      { username: "ByteCrafter", email: "bytecrafter@example.com" },
      { username: "SyntaxSeeker", email: "syntaxseeker@example.com" },
      { username: "PixelPilot", email: "pixelpilot@example.com" },
    ]);
    console.log("Seeded Users");

    const thoughts = await Thought.insertMany([
      {
        thoughtText: "CSS is so cool!!",
        username: users[0].username,
        reactions: [
          {
            reactionBody: "Indeed!",
            username: users[1].username,
          },
          {
            reactionBody: "Ehh...I dont know.",
            username: users[2].username,
          },
        ],
      },
      {
        thoughtText: "JavaScript is tough.",
        username: users[1].username,
        reactions: [
          {
            reactionBody: "Just keep practicing!",
            username: users[0].username,
          },
        ],
      },
      {
        thoughtText: "DAE love Node?!?",
        username: users[0].username,
        reactions: [
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "YAS!",
            username: users[1].username,
          },
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "Node <3",
            username: users[2].username,
          },
        ],
      },
      {
        thoughtText: "MongoDB is fun to use.",
        username: users[1].username,
        reactions: [
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "Agreed!",
            username: users[0].username,
          },
        ],
      },
      {
        thoughtText: "Send me you funniest NPM packages.",
        username: users[2].username,
        reactions: [
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "Brototype!!",
            username: users[3].username,
          },
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "Cowsay :-)",
            username: users[4].username,
          },
        ],
      },
      {
        thoughtText: "I love programming",
        username: users[3].username,
        reactions: [],
      },
      {
        thoughtText: "Isnt Javascript the best?",
        username: users[4].username,
        reactions: [
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "Indeed!",
            username: users[0].username,
          },
          {
            reactionId: new mongoose.Types.ObjectId(),
            reactionBody: "Absolutely!",
            username: users[1].username,
          },
        ],
      },
    ]);
    console.log("Seeded Thoughts and Reactions");

    const friendships = [
      { user: users[0]._id, friends: [users[1]._id, users[2]._id] },
      { user: users[1]._id, friends: [users[0]._id, users[3]._id] },
      {
        user: users[2]._id,
        friends: [users[0]._id, users[3]._id, users[4]._id],
      },
      { user: users[3]._id, friends: [users[1]._id, users[4]._id] },
      { user: users[4]._id, friends: [users[2]._id, users[3]._id] },
    ];

    await Promise.all(
      friendships.map(({ user, friends }) => {
        return User.findByIdAndUpdate(user, { $addToSet: { friends } });
      })
    );

    process.exit(0);
  };

  seedData().catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
});
