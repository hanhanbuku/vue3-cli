import path from 'path'
import fs from 'fs-extra'

/**
 * 将一些需要注册的依赖库添加到package.json中
 */

export const handleAddPackage = (templatePath,anwser)=>{
    // 定义 package.json 的路径
    const packageJsonPath = path.join(templatePath, 'package.json');

    // 读取 package.json
   return  fs.readFile(packageJsonPath,'utf-8').then(res=>{
       const context = JSON.parse(res)
       if(anwser.ui){
           context.dependencies[anwser.ui] = anwser.ui==='element-plus'?'^2.7.3':'^4.2.1'
        }
        if(anwser.checkRouter){
            context.dependencies['vue-router'] = '^4.3.2'
        }
        if(anwser.checkAxios){
            context.dependencies['@itachi3/ncaxios'] = '^1.0.6'
        }
        if(anwser.checkVuex){
            context.dependencies['vuex'] = '^4.1.0'
        }
       fs.writeFile(packageJsonPath,JSON.stringify(context,null,2),'utf-8')
   })
}
