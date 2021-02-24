const path = require('path');                         // 路径模块
const Log = require("../log");                       // 控制台输出
const Util = require('../util');                      // 工具函数
let Config = require('../config');                    // 获取配置项

async function createPage(pageName,createDir) {
    // 模版文件路径
    let templateRoot = path.join(Config.template, '/page');
    if (!Util.checkFileIsExists(templateRoot)) {
        Log.error(`未找到模版文件, 请检查当前文件目录是否正确，path: ${templateRoot}`);
        return;
    }
    // 业务文件夹路径
    let page_root = '';
    if(createDir){
      let isExists = await Util.checkFileIsExists(path.join(createDir));
      if (!isExists) {
        Log.error(`不存在当前路径：${createDir}`);
        return;
      }else{
        page_root = path.join(createDir, pageName)
      }
    }else{
      let isRoot = await Util.checkFileIsExists(path.join(Config.entry, '/src/views'));
      if(isRoot){
        page_root =  path.join(Config.entry, '/src/views', pageName)
      }else{
        page_root =  path.join(Config.entry, pageName)
      }
    }
    
    // 查看文件夹是否存在
    let isExists = await Util.checkFileIsExists(page_root);
    if (isExists) {
        Log.error(`当前页面已存在，请重新确认, path: ` + page_root);
        return;
    }
    // 创建文件夹
    await Util.createDir(page_root);
    // 获取文件列表
    let files = await Util.readDir(templateRoot);
    // 复制文件
    await Util.copyFilesArr(templateRoot, `${page_root}/${pageName}`, files);
    // 替换文件中的内容
    let newfiles = await Util.readDir(`${page_root}`);
    await Util.fileStrReplace(`${page_root}`,newfiles,'\\$fileName\\$',pageName);
    // 成功提示
    Log.success(`创建页面成功, path: ` + page_root);
}

// Main
module.exports = function(name,createDir) {
    createPage(name,createDir);
};
