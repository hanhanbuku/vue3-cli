import path from 'path'
import fs from 'fs-extra'

const __dirname = path.resolve();

/**
 * 往模板中添加vuex库相关代码
 */
export const handleAddVuex = (templatePath) => {
    const storeContent =
        `import { createStore } from 'vuex';

export default function() {
  return createStore({
    state: {
      count: 0
    },
    getters: {
      count: state => state.count
    },
    mutations: {
      increment(state) {
        state.count++;
      }
    },
    actions: {
      increment(context) {
        context.commit('increment');
      }
    }
  });
}`
    const storePath = path.join(templatePath, 'src/store');
    const storeFilePath = path.join(storePath, 'index.js');
    // 确保 store 目录存在
    fs.ensureDirSync(storePath);
    // 写入
    fs.outputFileSync(storeFilePath, storeContent);

    // 定义 main.js 的路径
    const mainJsPath = path.join(templatePath, 'src', 'main.js');
    return fs.readFile(mainJsPath,'utf-8').then(content=>{
        console.log(content)
        // 定义 Vuex 相关的代码片段
        const vuexImportStatement = "import store from './store'";

        // 修改 main.js 的内容，添加 Vuex 相关的代码
        let updatedContent = content;

        // 确保不在文件中重复添加相同的代码
        if (!updatedContent.includes('import store from')) {
            updatedContent = updatedContent.replace("import App from './App.vue'",
                `import App from './App.vue'\n${vuexImportStatement}`
            );
            updatedContent = updatedContent.replace(
                'createApp(App).',
                `createApp(App).use(store).`
            );
        }
        return fs.writeFile(mainJsPath, updatedContent, 'utf-8');
    })
}
