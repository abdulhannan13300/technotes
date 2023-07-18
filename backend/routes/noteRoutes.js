const express = require("express");
//Two ways to import the controller one is below an other is used in userRoutes.
const {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const router = express.Router();

router
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

module.exports = router;
