const express = require('express')
const fetchData = require('../middleware/fetchData')
const routes = express.Router()
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const { find } = require('../models/Notes');
// Route 1: get all notes of current user using get-- login required
routes.get('/fetchNotes', fetchData, async (req, res)=>{
    try {
        const notes = await Notes.find({User: req.user.id})
        res.send(notes)
    } catch (error) {
        res.status(500).send('sone internal error occurred')
    }
})


// Route 2: add new note of current user using post-- login required
routes.post('/addnote', fetchData,[body('title').isLength({ min: 3 }),
body('description').isLength({ min: 5 })], async (req, res)=>{
     // if there are errors return bad request and log errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

   const {title, description, tag} = req.body;
    try {
        const notes = new Notes({
            title, description, tag, user : req.user.id
        })
        let note = await notes.save()
        res.send(note)
    } catch (error) {
        res.status(500).send('sone internal error occurred')
    }
})

// Route 3: update note of current user using post-- login required
routes.put('/updatenote/:id', fetchData,[body('title').isLength({ min: 3 }),
body('description').isLength({ min: 5 })], async (req, res)=>{
     // if there are errors return bad request and log errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

   const {title, description, tag} = req.body;
   let newNote={}
   if(title){newNote.title= title};
   if(description){newNote.description= description};
   if(tag){newNote.tag= tag};
    try {
        // find note to be updated
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send('Not found')};
        if(note.user.toString() !== req.user.id){ return res.status(401).send("access denied")};
            note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
            res.send(note)
    } catch (error) {
        console.log(error)
        res.status(500).send('sone internal error occurred')
    }
})


// Route 4: delete note of current user using delete-- login required
routes.delete('/deletenote/:id', fetchData, async (req, res)=>{
    try {
        // find note to be updated
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send('Not found')};
        if(note.user.toString() !== req.user.id){ return res.status(401).send("access denied")};
            note = await Notes.findByIdAndDelete(req.params.id);
            res.send({'success':"note hs been deleted", note})
    } catch (error) {
        console.log(error)
        res.status(500).send('sone internal error occurred')
    }
})


module.exports = routes