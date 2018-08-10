/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const levelDB = require('./levelSandbox.js');
const chaindb = levelDB.getDbReference();
let key = 1000;
console.log("levelDB");
console.log(levelDB.height);
console.log(levelDB.getLevelDBData(501));


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock){
    // Block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    key += 1;
    this.chain.push(newBlock);
    // add data to level db
    levelDB.addLevelDBData(key,newBlock);
  }

  // Get block height
    getBlockHeight(){
      let x = 0;
	    chaindb.createReadStream().on('data', function(data) {
		          x++;
		    }).on('error', function(error) {
		    return console.log('something not correct in height', err0r)
		  }).on('close', function() {
		        console.log('Height # ' + x);
		    return x;
		  });
    }

    // get block
    getBlock(blockHeight){
      levelDB.getLevelDBData(blockHeight).then(function(data){
        console.log("i'm sure");
        console.log(data);
        return data;
      });
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.getBlockHeight()-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.getBlock[i].hash;
        let previousHash = this.getBlock[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

// testing 

// (function theLoop () {
//     setTimeout(function () {
//       let blockchain = new Blockchain();
//       // blockchain.addBlock(new Block("lalit singh"));
//       blockchain.getBlockHeight();
//       console.log(blockchain.getBlock(1001));
//     }, 100);
//   })();