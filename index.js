const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');


mongoose.connect('mongodb://127.0.0.1:27017/todolistApp')
    .then(() =>
        console.log("CONNECTING TO MONGODB"))
    .catch((err) => {
        console.log("ERROR 404")
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))



const toDoListSchema = new mongoose.Schema({
    name: String,
    done: {
        type: Boolean,
        default: false
    }
})
const notesSchema = new mongoose.Schema({
    heading: String,
    matter: String
})

const Todo = new mongoose.model('Todo', toDoListSchema)
const Note = new mongoose.model('Note', notesSchema); // Use PascalCase for model names


app.get('/home', (req,res) => {
    res.render('first')
})
app.get('/todolist', async (req, res) => {
    const todos = await Todo.find({})
    res.render('home', { todos: todos });

})
app.post('/todolist', async (req, res) => {
    // const Todo = new mongoose.model('Todo', toDoListSchema)
    const newTask = new Todo(req.body)
    await newTask.save();
    res.redirect('/todolist')
})
app.delete('/todolist/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.redirect('/todolist');
})
app.put('/todolist/:id', async (req, res) => {
    const { id } = req.params;
    const foundTask = await Todo.findByIdAndUpdate(id, { runValidators: true, new: true, done: true })
    res.redirect('/todolist')
    console.log(foundTask)
})
app.get('/notes', async (req,res) => {
  const notes = await Note.find({})
  res.render('journalindex', { notes: notes });
})
app.get('/notes/create', (req,res) => {
    res.render('create')
})
app.get('/notes/:id', async(req,res) => {
   const { id } = req.params;
   console.log(id);
const foundNote = await Note.findById(id);
 res.render('details', { foundNote: foundNote});
})

app.post('/notes', async(req,res) => {
    const newNote = new Note(req.body);
    await newNote.save();
    res.redirect('/notes')
})
app.get('/notes/:id/edit', async(req,res) => {
    const { id } = req.params;
    const foundNote = await Note.findById(id);
    console.log(foundNote);
  res.render('edit', {foundNote});
})
app.put('/notes/:id', async(req,res) => {
    const { id } = req.params;
  const foundNote = await Note.findByIdAndUpdate(id, req.body, { runValidators: true, new: true})
  res.redirect(`/notes/${foundNote._id}`);

})
app.delete('/notes/:id', async (req,res) => {
    const { id } = req.params;
 await Note.findByIdAndDelete(id)
    res.redirect('/notes')
})

app.listen(3000, () => {
    console.log("LISTENING TO PORT 3000");
})