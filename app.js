const express = require('express');
const cors = require('cors');

require('dotenv').config();


const app = express();

const port = process.env.port || 3000;

app.use(cors({
  origin: "*",
}));

app.use(express.json());



const transactionRoutes = require("./routes/transaction");

app.use('/api/transactions', transactionRoutes);


app.listen(port, () => {
  console.log(`listeniong on port ${port}`);
});