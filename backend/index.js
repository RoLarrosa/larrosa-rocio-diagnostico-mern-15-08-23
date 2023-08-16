const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

//mongodb://RocioDiag:I7SfcE4YfuawbktN@localhost:27017/diagnostico?authSource=admin

const user = 'rocio';
const password = 'rocio';
const dbname = 'diagnostico';


//const uri = `mongodb+srv://${user}:${password}@cluster0.aixqygc.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const uri = 'mongodb://localhost:27017/diagnostico'
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});


const taskSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

app.get('/Tasks', async (req, res) => {
    console.log('hola')
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/Tasks', async (req, res) => {
  const newTask = new Task({ titulo: req.body.titulo,descripcion: req.body.descripcion, completed: false });
  await newTask.save();
  res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
