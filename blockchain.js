const sha256 = require('js-sha256').sha256;
var express = require('express')
var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
class Block {
    constructor(index, data, previousHash, proofOfWork) {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data
        this.previousHash = previousHash;
        this.hash = this.getHash();
        this.proofOfWork = proofOfWork;


    }
    getHash() {

        return sha256.create().update(JSON.stringify(this.data) + this.previousHash + this.index + this.timestamp).hex();


    }


}

class BlockChain {
    constructor() {

        this.chain = [];


    }

    proofOfWork(previousProof) {

        console.log(previousProof)

        var proof = 1;
        var correctProof = false;

        while (correctProof == false) {
            // console.log(proof)

            var hash = sha256.create().update((proof ** 2 - previousProof ** 2).toString()).hex().toString();


            if (hash.slice(0, 3) == '000') {
                correctProof = true;
            } else {
                proof += 1;

            }




        }

        return proof;

    }

    //533 1
    addBlock(data) {

        var proofOfWork = this.chain.length !== 0 ? this.proofOfWork(this.chain[this.chain.length - 1].proofOfWork) : 1;
        var index = this.chain.length;
        var previousHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
        var block = new Block(index, data, previousHash, proofOfWork)
        this.chain.push(block)

        return block;
    }

    chainIsValid() {
        for (var i = 0; i < this.chain.length; i++) {
            if (this.chain[i].hash != this.chain[i].getHash()) {
                return false
            }

            if (i > 0 && this.chain[i].previousHash !== this.chain[i - 1].hash) {
                return false;
            }

            return true;
        }
    }
}

const Rupaiya = new BlockChain();


console.log(Rupaiya.chain)


app.post('/mine_block', (req, res) => {




    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var amount = req.body.amount;

    var obj = Rupaiya.addBlock({
        "sender": sender,
        "receiver": receiver,
        "amount": amount
    })

    res.send(obj);


})

app.get('/get_chain', (req, res) => {
    res.send(Rupaiya.chain);
})

app.listen(3000);
