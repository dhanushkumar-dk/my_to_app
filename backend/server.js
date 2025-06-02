const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./db");
const cors = require("cors");
const Todo = require("./models/db");
const corsOptions = {
  origin: process.env.APPLICATION_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();

connectDB();

app.use(cors(corsOptions));
app.use(bodyParser.json());

// **GET method - Retrieve all todos**
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **POST method - Add a new todo**
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res
      .status(201)
      .json({ message: "Todo added successfully!", todo: newTodo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **DELETE method - Delete a todo by ID**
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res
      .status(200)
      .json({ message: "Todo deleted successfully!", deletedTodo: todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
