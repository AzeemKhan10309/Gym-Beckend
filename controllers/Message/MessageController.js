import Message from '../../Models/Message.js';
import Member from '../../Models/membersModel.js';
import Trainer from '../../Models/trainerModel.js';
export const sendMessage = async (req, res) => {
  const { title, body, targetType, targetId } = req.body;

  if (!title || !body || !targetType) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const message = new Message({
    title,
    body,
    sentBy: 'admin',
    targetType,
    targetId: targetType === 'all' ? null : targetId,
  });

  await message.save();

  res.status(201).json({ message: 'Message sent successfully' });
};
export const getMemberDropdown = async (req, res) => {
  const members = await Member.find({}, '_id name');
  res.json(members);
};
export const getTrainerDropdown = async (req, res) => {
  const trainers = await Trainer.find({}, '_id name');
  res.json(trainers);
};
