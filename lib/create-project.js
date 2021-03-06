const path = require('path');                         // 路径模块
const Log = require("../log");                       // 控制台输出
const Util = require('../util');                      // 工具函数
let Config = require('../config');                    // 获取配置项

async function createProject(projectName,template) {
    // 模版文件路径
    if(!template){
      template = 'minimal'
    }
    let templateRoot = path.join(Config.template, '/'+template);
    if (!Util.checkFileIsExists(templateRoot)) {
        Log.error(`未找此模版, 请检查模版名称是否正确: ${template}`);
        return;
    }
    // 业务文件夹路径
    let page_root = path.join(Config.entry,projectName);
    // 查看文件夹是否存在
    let isExists = await Util.checkFileIsExists(page_root);
    if (isExists) {
        Log.error(`当前目录已存在，请重新确认, path: ` + page_root);
        return;
    }
    // 创建文件夹
    await Util.createDir(page_root);
    // 复制文件
    Util.copyFolder(templateRoot,page_root,function(){
      Log.success(`创建项目成功, path: ` + page_root+ `\n cd ${projectName} \n npm instal \n npm run serve`);
    })
}

// Main
module.exports = function(name,template) {
    createProject(name,template);
};
