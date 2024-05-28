import path from 'path'
import fs from 'fs-extra'

/**
 * 往模板中添加ui库相关代码
 */
export const handleAddUi = (templatePath,ui)=>{
    const mainPath = path.join(templatePath, 'src/main.js');
    return fs.readFile(mainPath,'utf-8').then(content=>{
        console.log(content)
        // 定义 el 相关的代码片段
        const elImportStatement = "import ElementPlus  from 'element-plus'\nimport 'element-plus/dist/index.css'\n"
        // 定义antd 相关的代码片段
        const antdImportStatement = "import Antd from 'ant-design-vue'\nimport 'ant-design-vue/dist/reset.css'\n"

        // 修改 main.js 的内容，添加 Vuex 相关的代码
        let updatedContent = content;

        updatedContent = updatedContent.replace("import App from './App.vue'",
            `import App from './App.vue'\n${ui==='element-ui'?elImportStatement:antdImportStatement}`
        );
        updatedContent = updatedContent.replace(
            'createApp(App).',
            `createApp(App).use(${ui==='element-ui'?'ElementPlus':'Antd'}).`
        );
        return fs.writeFile(mainPath, updatedContent, 'utf-8');
    })
}
