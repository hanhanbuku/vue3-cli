import path from 'path'
import fs from 'fs-extra'

/**
 * 动态添加nc-axios
 */
export const handleAddRequest = (templatePath)=>{
    const ncAxiosContent =
        `import {  NcRequest } from '@itachi3/ncaxios'

const request = new NcRequest({
    base:{},
    interceptReqSuccess:(config)=>{
        return config
    },
    interceptReqError:(config)=>{
        return config
    },
    interceptResSuccess:(config)=>{
        return config
    },
    interceptResError:(config)=>{
        return config
    }
})`
    const apiPath = path.join(templatePath, 'src/api');
    const apiFilePath = path.join(apiPath, 'index.js');

    // 确保 store 目录存在
    fs.ensureDirSync(apiPath);
    // 写入
    fs.outputFileSync(apiFilePath, ncAxiosContent);
}
