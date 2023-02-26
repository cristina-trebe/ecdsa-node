const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "044908d6b373ef47db48a5f4628a3ccee7e800e1a47ef52e5efe695e9195cd882888751cf8cac82b4351d399e61518f407d6be0a060ba08ebc9303cad79654fc94": 100, // alice
  "049389190d3cb72ae609628a12061ec6a4b42aa310ec489fb8c48a5cec8b2d6bdd2e3bbba28e8004d1f795f2b17e371cf31ae9fe88d6ed1dce6ab879348e1cfd02": 50, //max
  "04a0c8ccb79cd3e5284f4c4b64437bd1adfcb5ea92bce2d798848ef9adeda024cf1135da35954db7fdebcc10bc9e2c4b0a0e55339e64b4ed6d017e1e6687663fb3": 75, // dan
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
