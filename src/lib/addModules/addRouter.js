import path from 'path'
import fs from 'fs-extra'

/**
 * 往模板中添加路由相关代码
 */
export const handleAddRouter = (templatePath)=>{
    const routerPath = path.join(templatePath, 'src/router');
    const storeFilePath = path.join(routerPath, 'index.js');
    // 确保目录存在
    fs.ensureDirSync(routerPath);

    fs.outputFileSync(storeFilePath,
        `import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import About from '../components/About.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
  // ...其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;`);
    // 创建视图组件
    const componentsPath = path.join(templatePath, 'src/components');
    fs.ensureDirSync(componentsPath);

    const homePath = path.join(componentsPath, 'Home.vue');
    fs.writeFileSync(homePath,
        `<template>
  <div>Home Page</div>
</template>

<script>
export default {};
</script>`);

    const aboutPath = path.join(componentsPath, 'About.vue');
    fs.writeFileSync(aboutPath,
        `<template>
  <div>About Page</div>
</template>

<script>
export default {};
</script>`);

    // 修改主组件
    const appPath = path.join(templatePath, 'src/App.vue');
    fs.writeFileSync(appPath,
        `<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {};
</script>`);
    // 更新入口文件
   const mainPath = path.join(templatePath, 'src/main.js');
   return fs.readFile(mainPath,'utf-8').then(content=>{
        console.log(content)
        // 定义 router 相关的代码片段
        const routerImportStatement = "import router  from './router'";

        // 修改 main.js 的内容，添加 Vuex 相关的代码
        let updatedContent = content;

        updatedContent = updatedContent.replace("import App from './App.vue'",
            `import App from './App.vue'\n${routerImportStatement}`
        );
        updatedContent = updatedContent.replace(
            'createApp(App).',
            `createApp(App).use(router).`
        );
        return fs.writeFile(mainPath, updatedContent, 'utf-8');
    })
}
