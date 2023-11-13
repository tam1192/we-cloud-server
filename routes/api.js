var path = require('path');
var fs = require('fs/promises');
var express = require('express');
var router = express.Router();
// schema dir
const schemaDir = path.join(__dirname, '..', 'schemas');
// schema table
var table = require(path.join(__dirname, '..', 'models', 'index')).schema;

// 200: success/成功
//   204: bodyはないけどよかろうな
//   204: No data in the body, but the status is success.

// 400: failed/失敗

// 500: The requested operation failed./ 求められた処理に失敗

// list command
router.get('/:uuid', async (req, res) => {
  const userUuid = String(req.params.uuid);
  try{
    const querys = await table.findAll({ where: {useruuid: userUuid}});
    // スキーマは存在しない！
    // schema does not exist.
    if(querys.length == 0) {
      res.status(404).end();
      return;
    }
    // スキーマリストで反復処理
    // Iterate by schemas list.
    const schemas = [];
    querys.forEach(query => {
      // 返信用
      // for reply
      schemas.push(query.schemaname);
    });
    // jsonで返信
    // reply with json
    res.json(JSON.stringify(schemas)).end();
  } catch(err) {
    console.error(err);
    res.status(500).end();
  }
});

// download command
router.get('/:uuid/:schema', async (req,res)=>{
  const userUuid = String(req.params.uuid);
  const schemaName = String(req.params.schema);
  // schemaを探せ
  // find to schema
  try{
    const query = await table.findOne({where: {useruuid:userUuid, schemaname:schemaName}});
    console.debug(query);
    // クエリがない！
    // Not have query!
    if(query===null) {
      res.status(404).end();
      return;
    }
    // schema file path
    const schemaFile = path.join(schemaDir, query.useruuid, `${query.schemaname}.schem`);
    console.debug(schemaFile);
    // load file
    try{
      const file = await fs.readFile(schemaFile);
      res.send(file).end();
    }
    catch (err) {
      await table.destroy({where:{useruuid:userUuid, schemaname:schemaName}});
      console.error(err);
      //console.error('schema file is not found');
      res.status(404).end();
    }
  } catch(err) {
    console.error(err);
    res.status(500).end();
  }
});

// rename command
router.put('/:uuid/:schema', (req, res)=>{

});

// upload command
router.post('/:uuid/:name', async (req,res,next)=>{
  // request params
  const userUuid = String(req.params.uuid);
  const schemaName = String(req.params.name);
  if(schemaName==null||userUuid==null){ res.status(404).end(); return;}
  console.debug(req.params);
  // request header
  if(req.get('Content-Type')!='application/octet-stream'){
    res.status(405).end('Requested Content-Type is not allow');
    return;
  }
  // request body
  const data = req.body;
  if(data.length == 0){res.status(405).end('body does not exist.'); return}
  console.debug(req.data);
  // schema file
  const schemaUserDir = path.join(schemaDir, userUuid);
  const schemaFile = path.join(schemaDir, userUuid, `${schemaName}.schem`);
  // データが未登録であることを確認する。
  // Check the data to not define.
  // データベースに登録されてないデータは原則排除
  // If data is not registered in the database, the file is deleted.
  try{
    if(await table.findOne({where: { useruuid: userUuid, schemaname: schemaName}}) !== null){
      res.status(405).end('Requested schemaname is already registered.')
      return;
    }
    // ディレクトリを作成
    // Make a dir
    await fs.mkdir(schemaUserDir, {recursive: true});
    // 書き込み
    // write
    await fs.writeFile(schemaFile, data);
    // データベースに追加
    // add to database
    table.create({useruuid:userUuid, schemaname:schemaName});
    // ok!
    res.status(204).end();
  } catch(err) {
    console.error(err);
    res.status(500).end();
  }
  return;
});

// delete command
router.delete('/:uuid/:schema', async (req, res, next) => {
  const userUuid = String(req.params.uuid);
  const schemaName = String(req.params.schema);
  if(schemaName==null||userUuid==null){ res.status(404).end(); return;}
  try{
    // schemaを探せ
    // find to schema
    if(await table.findOne({ where: { useruuid: userUuid, schemaname: schemaName }})===null) {
      // クエリがない！
      // Not have query!
      res.status(404).end();
      return;
    }
    // 実ファイルが存在しない場合はDBだけ処理をして成功判定
    // If the actual schema file is not found, only the database process will succeed.
    try{
      await fs.unlink(path.join(schemaDir , userUuid, `${schemaName}.schem`));
    } catch (err) {
      console.error(err);
    }
    // エラーでも処理は継続される 
    // Even if error, process continues.
    await table.destroy({where:{useruuid:userUuid, schemaname:schemaName}});
    res.status(204).end();
  } catch(err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = router;