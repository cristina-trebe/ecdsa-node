const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04761763eaaad9a87e770a625c14e533235adae60961d28ba37a9fadb1065dc80fc535743ce8253018e34b1fb5aed7708510dc25e95dc6b1ccf293dbac764bcfd": 100, // alice
  "040855be1ccef91c435c0422ce30729298bb0a74f9feac5fda89d626bae36e8c5cd24b8955a8a5be6d24de3a4803e1ffad74963eb500fca83ff35eab561b7520b9": 50, //max
  "0424463eb6cefae0f0d416a56f219fa22a97e2f2440ca82b8169225b177a36f6e5f4cd45a52eac9e08d13936c47604e5fd2e1688161cb4cc233bb43f0c1199b57a": 75, // dan
  "0x4": 40, //paul
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client-side application
  // recover the public address from the signature
  
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
