const fs = require('fs');
const path = require('path');

/**
 * 簡易テスター
 * 各メソッドを簡易的にテストしていきます。
 */

// 変数
const address = 'localhost:3000';
const schemaData = path.join(__dirname, 'csx1973.schem');
const userUuid = 'ex1234';
const schemaName = 'ex1234';

// response debuger

function resdbg(res) {
    console.log(res.status);
    let bool = false;
    bool = res.status!=204 && res.status!=404;
    if(bool) res.text().then(console.log);
}

// upload
async function upload(){
    // data
    const data = fs.readFileSync(schemaData);
    // url
    const url = new URL(`http://${address}/api/${userUuid}/${schemaName}`);

    // 405: contenttype
    resdbg(await fetch(url, {body:data, method:'POST'}));
    
    // 405: body
    resdbg(await fetch(url, {
        method:'POST', 
        headers:{'Content-Type':'application/octet-stream'}
    }));

    // 204
    resdbg(await fetch(url, {
        body: data,
        method:'POST',
        headers:{'Content-Type':'application/octet-stream'}
    }));

    // 405: already
    resdbg(await fetch(url, {
        body: data,
        method:'POST',
        headers:{'Content-Type':'application/octet-stream'}
    }));
}

async function list(){
    const url = new URL(`http://${address}/api/${userUuid}`);
    const res = await fetch(url, {
        method: 'get'
    });
    //res.text().then(console.log);
    resdbg(res);
}

async function del() {
    // url
    const url = new URL(`http://${address}/api/${userUuid}/${schemaName}`);
    // 204
    resdbg(await fetch(url, {
        method: 'DELETE',
    }));
    // 404
    resdbg(await fetch(url, {
        method: 'DELETE',
    }));
}

(async()=>{
    //await upload();
    //await list();
    await del();
    //await list();
})();

