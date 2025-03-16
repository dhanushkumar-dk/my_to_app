const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors());

const MONGO_URI =
  "mongodb+srv://admin:dhanush123@cluster0.i31li.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define the Mongoose schema
const todoSchema = new mongoose.Schema({
  category: { type: String, required: true },
  hostname: { type: String, required: true },
  details: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      src: { type: String },
    },
  ],
  status: {
    type: String,
    enum: ["completed", "not completed"],
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// **POST method - Add a new todo**
app.post("/todos", async (req, res) => {
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

// **GET method - Retrieve all todos**
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **DELETE method - Delete a todo by ID**
app.delete("/todos/:id", async (req, res) => {
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
