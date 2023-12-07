const { TonClient, WalletContractV4, internal } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");
const https = require('https');

const fs = require('fs');
const path = require('path');


// Jumlah upaya maksimum
const maxTimes = 10000;

async function main(mnemonic, index) {
  const mnemonics = mnemonic.split(' ');
  let keyPair = await mnemonicToPrivateKey(mnemonics);
  let workchain = 0;
  let wallet = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  });
// Create Client
const client = new TonClient({
    endpoint:
        "https://toncenter.com/api/v2/jsonRPC",
        // "https://ton.access.orbs.network/55B2c0ff5Bd3F8B62C092Ab4D238bEE463E655B2/1/mainnet/toncenter-api-v2/jsonRPC"
        // "https://ton.access.orbs.network/55B1c0ff5Bd3F8B62C092Ab4D238bEE463E655B1/1/mainnet/toncenter-api-v2/jsonRPC",
        //"https://ton.access.orbs.network/44A2c0ff5Bd3F8B62C092Ab4D238bEE463E644A2/1/mainnet/toncenter-api-v2/jsonRPC",
});


  try {
     await sleep(1500);
  let contract = client.open(wallet);
  console.log(wallet.address + ' memulai operasi');
  let balance = await contract.getBalance();
  console.log(`TIDAK${index}dompet：【${wallet.address}  】，keseimbangan：${balance}`)
    if (balance == 0) {
      console.log(`TIDAK.${index}dompet：【${wallet.address}  】，Saldo 0, coba lagi dalam 3 menit`)
      await sleep(180000);
      throw new Error('Saldo adalah 0');
    }


  let v = [];

  for (let i = 0; i < 4; i++) {
    v.push(
      internal({
        to: `EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c`,
        value: '0',
        body: 'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}'
      })
    );
  }
  let count = 0;
  let seqno = -1;
  let lastSuccess = true
  let lastError = ''

  for (let i = 0; i < maxTimes; i++) {
    // await sleep(1000);
    try {
      if (seqno === -1 || lastSuccess || lastError.indexOf('seqno') > -1) {
        seqno = await contract.getSeqno();
      }
      console.log('seqno' , seqno);
      // await sleep(1100);
      let transfer = await contract.sendTransfer({
        seqno: seqno,
        secretKey: keyPair.secretKey,
        validUntil: Math.floor(Date.now() / 1e3) + 600,
        messages: v,
      });
      console.log(transfer);
      count++;
      console.log(`ASOYYY${index}个dompet：【${wallet.address}  】，ASOYYY${count}kesuksesan`);
      lastSuccess = true
    } catch (error) {
      lastSuccess = false
      console.log(`Asuuu${index}dompet：【${wallet.address}  】`, error.response.data.code, error.response.data.error)
    }
    
  }
  } catch (err) {
    console.log('create client error', err.response && err.response.data ? err.response.data.code : err.response, err.response && err.response.data ? err.response.data.error : '')
    console.log(`Silahkan Coba lagi.${index}dompet`)
    main(mnemonic, index)
  }
}

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}


const getPhrase = () => {
  try {
  const phrases = fs.readFileSync(path.join(__dirname, './phrases.txt'), 'utf-8');
  return phrases.split('\n');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Tidak ditemukan phrases.txt File, file otomatis dibuat')
      fs.writeFileSync(path.join(__dirname, './phrases.txt'), '');
    } else {
      console.log(error);
    }
    return [];
  }
}

const mnemonicList = getPhrase().map(t => t ? t.trim() : '').filter(t=>t && t.indexOf('#')==-1 && (t.split(' ').length === 12 || t.split(' ').length === 24));

if (mnemonicList.length === 0) {
    console.error(`
    ******************************************************
    Tidak ditemukan mnemonik dompet yang valid，Silakan masukkan direktori saat ini phrases.txt Isi dokumennya
    Membutuhkan frase mnemonik 12 digit atau 24 digit，satu per baris
    Anda dapat menambahkan komentar yang diawali dengan #. Berikut contoh filenya：
    # Ini adalah komentar dompet saya
    word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13 word14 word15 word16 word17 word18 word19 word20 word21 word22 word23 word24
    ******************************************************`)
  return
} else {
    console.log(`Ditemukan kali ini${mnemonicList.length}frase mnemonik`)
}

const checkStatus = (addr) => {
  // get bertanya https://api.ton.cat/v2/contracts/address/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c，Dalam data json yang dikembalikan meta.is_suspended Bila true, kontrak dibekukan
  const url = `https://api.ton.cat/v2/contracts/address/${addr}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.on('data', (d) => {
        const data = JSON.parse(d);
        // console.log(data);
        if (data.meta.is_suspended) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  });
}

        mnemonicList.forEach((t, index) => {
          main(t, index + 1);
        });

/*
const run = () => {
  checkStatus('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c').then(
    (res) => {
      if (res) {
      } else {
        const waitTime = 10;
        console.log(
          `Kontraknya dibekukan, menunggu${waitTime}Coba lagi dalam hitungan detik, waktu saat ini：`,
          new Date().toLocaleString()
        );
        setTimeout(() => {
          run();
        }, waitTime * 1000);
      }
    }
  );
};

run();
*/
