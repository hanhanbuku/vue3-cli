import downloadGitRepo from 'download-git-repo';
import {installDependencies, loading} from './utils.js'
import {getRepoList} from './request.js'
import chalk from 'chalk'
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path'
// import resolve from 'resolve'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import {handleAddVuex,handleAddUi,handleAddRouter,handleAddRequest,handleAddPackage} from './addModules/index.js'

const __dirname = path.resolve();

// 添加依赖的合集
const modulesMap = {
    ui:handleAddUi,
    checkRouter:handleAddRouter,
    checkAxios:handleAddRequest,
    checkVuex:handleAddVuex
}

class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName
        this.dir = targetDir
        // 将download-git-repo包装成promise
        this.downloadGitRepo =(url,branchName) => {
            return new Promise((resolve, reject) => {
                downloadGitRepo(url,this.dir, { },(err)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                })
            })
        }
    }
    // 获取所有的分支
    fetchRepo = async () => {
        const branches = await loading(getRepoList, '正在获取模板列表');
        return branches;
    }
    // 下载分支
    download = async (branchName)=>{
        try {
            // 1 拼接下载路径
            const requestUrl = `hanhanbuku/vue3_template/#${branchName}`;
            // 2 把资源下载到某个路径上
            return this.downloadGitRepo(requestUrl, branchName);
        } catch (error) {
            console.error(`下载分支出错: ${error.message}`);
            throw error; // 重新抛出错误
        }
    }
    // 选择模板的方式创建
    createTemplate = async (manager)=>{
        const spinner = ora('正在获取模板...').start();
        loading.color = 'yellow'
        try{
            // 先拉去所有分支
            const branches = await this.fetchRepo()
            spinner.succeed('模板获取成功！');
            // 这里会在shell命令行弹出选择项，选项为choices中的内容
            const { curBranch } = await inquirer.prompt([
                {
                    name: 'curBranch',
                    type: 'list',
                    // 提示信息
                    message: '请选择需要下载的模板',
                    // 选项
                    choices: branches
                        .filter((branch) => branch.name !== 'main')
                        .map((branch) => ({
                            name: branch.name,
                            value: branch.name,
                        })),
                },
            ]);
            // 下载目标分支
            spinner.start('正在下载模板...')
            await this.download(curBranch)
            spinner.succeed('模板生成成功...');
            // 安装依赖
            await installDependencies(this.dir,manager)
        }catch (e){
            spinner.fail('模板生成失败：' + e)
        }
    }
    // 入口函数
    create = async (anwser)=>{
        const spinner = ora('正在获取模板...').start();
        loading.color = 'yellow'
        try{
            // 将cli中的模板文件拷贝到本地
            // 获取 CLI 工具模块的路径
            const sourcePath = path.resolve(
                fileURLToPath(import.meta.url), // import.meta.url es模块中当前文件所处的位置
                '../../template',
                `vue3-${anwser.lang}`,
            )
            const targetPath = path.join(process.cwd(), this.name);
            // 将模板拷贝到本地
            await fs.copy(sourcePath, targetPath);
            // 动态添加依赖库
            for (let key in anwser){
                if(key!=='lang'&&key!=='nodeModules'&& anwser[key]!==false){
                    await modulesMap[key](targetPath,modulesMap[key])
                }
            }
            // // 动态新增package.json里的内容
            await handleAddPackage(targetPath,anwser)
            spinner.info('正在添加依赖...');
            // 安装依赖
            await installDependencies(this.dir,anwser.nodeModules)
        }catch (e){
            spinner.fail('模板生成失败：' + e)
        }
    }
}

export default Creator
