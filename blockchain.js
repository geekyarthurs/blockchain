
const sha256 = require('js-sha256').sha256;
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

    proofOfWork(previousProof){

        console.log(previousProof)

        var proof = 1;
        var correctProof = false;
        
        while(correctProof == false){
            // console.log(proof)
           
          var hash = sha256.create().update((proof**2 - previousProof**2).toString()).hex().toString();
           console.log(hash)
            
            if(hash.slice(0,3) == '000'){
                correctProof = true;
            }else{
                proof += 1;
                
            }


            

        }

        return proof;

    }

//533 1
    addBlock(data) {
        
        var proofOfWork = this.chain.length !== 0 ?  this.proofOfWork(this.chain[this.chain.length - 1].proofOfWork) : 1;
        var index = this.chain.length;
        var previousHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
        var block = new Block(index, data, previousHash,proofOfWork)
        this.chain.push(block)
    }

    chainIsValid() {
        for (var i = 0; i < this.chain.length; i++) {
            if (this.chain[i].hash != this.chain[i].getHash()) {
                return false
            }

            if ( i > 0 && this.chain[i].previousHash !== this.chain[i-1].hash){
                return false;
            }

            return true;
        }
    }
}

const Rupaiya = new BlockChain();
Rupaiya.addBlock({sender: 'Mahesh', receiver : 'Prajin', amount : 1500})
Rupaiya.addBlock({sender: 'Mahesh', receiver : 'Prajin', amount : 1500})

console.log(Rupaiya.chain)
