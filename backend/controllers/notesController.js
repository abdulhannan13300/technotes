const asyncHandler = require("express-async-handler");
const Note = require("../models/Notes");
const User = require("../models/User");

//@desc Get all notes
//@ GET /notes
//@access Private
const getAllNotes = asyncHandler(async (req, res) => {
  //Get All notes
  const notes = await Note.find().lean();

  //If no notes
  if (!notes?.length) {
    return res.status(200).json({ message: "No notes found" });
  }

  //Add username to each note before sending the response.
  //We can also do using the for..of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
});

//@desc Create new note
//@ POST /notes
//@access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  //check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "Duplicate note title" });
  }

  //Create a new note
  const note = await Note.create({ user, title, text });
  if (note) {
    return res.status(201).json({ message: "New note Created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
});

//@desc Update note
//@ PATCH /notes
//@access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  //confirm note exists to update
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate && duplicate?._id.toString !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }
  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res.json({ message: `${updatedNote} updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }
  //Confirm note exists to delete
  const note = await Note.findOne(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  //delete the note
  const result = await note.deleteOne();
  const reply = `Note '${result.title}' with ID '${result._id}' deleted`;
  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
