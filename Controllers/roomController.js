const tryCatch = require("./utils/tryCatch");
const Room = require('../models/Rooms');
const createRoom =tryCatch( async (req, res) => {
  const { id: uid, name: uName, photoURL: uPhoto } = req.user;
  console.log(req.user);
  const newRoom = new Room({ ...req.body, uid, uName, uPhoto });
  await newRoom.save();
  res.status(201).json({ success: true, result: newRoom });
})

const getRooms = tryCatch(async (req, res) => {
  const rooms = await Room.find().sort({ _id: -1 });
  res.status(200).json({success:true,result:rooms})
})
module.exports = {createRoom,getRooms};

