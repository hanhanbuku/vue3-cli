import downloadGitRepo from 'download-git-repo';
import {loading} from './utils.js'
import {getRepoList} from './request.js'
import chalk from 'chalk'
import inquirer from 'inquirer';
import util from 'util'
import ora from 'ora';


class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName
        this.dir = targetDir
        // 将download-git-repo包装成promise
        this.downloadGitRepo =(url,path,branchName) => {
            return new Promise((resolve, reject) => {
                const spinner = ora(`正在下载分支-${branchName},请稍后...`);
                spinner.start();
                downloadGitRepo(url,path, { },(err)=>{
                    if(err){
                        spinner.fail('下载失败：'+ err);
                        reject(err)
                    }else{
                        spinner.succeed();
                        resolve(err)
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
        // 1 拼接下载路径
        const requestUrl = `hanhanbuku/vue3_template/#${branchName}`;
        // 2 把资源下载到某个路径上
        await this.downloadGitRepo(requestUrl, this.dir,branchName);
        console.log(chalk.green('done!'));
    }
    // 入口函数
    create = async ()=>{
        // 先拉去所有分支
        const branches = await this.fetchRepo()
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
        this.download(curBranch)
    }
}

export default Creator
