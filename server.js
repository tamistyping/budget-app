import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});

mongoose.connect(process.env.DATABASE_URL);

const budgetSchema = new mongoose.Schema({
  name: String,
  max: Number,
});

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
  },
});

const Budget = mongoose.model("budget", budgetSchema);
const Expense = mongoose.model("Expense", expenseSchema);

app.get("/", (req, res) => {
  res.json({
    message: "Server Running",
  });
});

app.get("/budgets", async (req, res) => {
  try {
    const allBudgets = await Budget.find({});
    res.json(allBudgets);
  } catch (e) {
    console.error(e);
  }
});

app.post("/budgets/new", (req, res) => {
  const budget = req.budget;
  const newBudget = new Budget({ name: budget.name, max: budget.max });
  newBudget
    .save()
    .then(() => {
      console.log("Budget saved");
      res.sendStatus(200);
    })
    .catch((e) => console.error(e));
});
