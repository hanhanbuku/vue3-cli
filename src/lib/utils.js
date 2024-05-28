import ora from 'ora';
import fs from "fs-extra";
import inquirer from "inquirer";
import {spawn} from 'cross-spawn'
import chalk from "chalk";

export const loading = async (fn, msg, ...args) => {
    // 计数器，失败自动重试最大次数为3，超过3次就直接返回失败
    let counter = 0;
    const run = async () => {
        const spinner = ora(msg);
        spinner.start();
        try {
            const result = await fn(...args);
            spinner.succeed();
            return result;
        } catch (error) {
            spinner.fail('出现了一些问题，正在尝试重新获取...');
            if (++counter < 3) {
                return run();
            } else {
                return Promise.reject();
            }
        }
    };
    return run();
};
/**
 * 检测文件是否存在
 */
export const filterFile = async (targetDir, options) => {
    // 先检测文件是否存在
    if (fs.existsSync(targetDir)) {
        // 用户是否选择了强制创建强制创建
        if (!options.force) {
            // 询问是否强制创建
            let {action} = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: '当前目录已存在:',
                choices: [
                    {
                        name: '覆盖',
                        value: 'overwrite'
                    }, {
                        name: '取消',
                        value: false
                    }
                ]
            }])
            if (!action) {
                process.exit(1);
            } else {
                fs.remove(targetDir)
                return Promise.resolve()
            }
        }
    }
}
/**
 * 安装依赖
 */
export const installDependencies = async (targetPath, manager) => {
    const managerMap = {
        npm: 'install',
        yarn: '',
        pnpm: 'install'
    };

    const command = managerMap[manager] || 'install';
    const spinner = ora(`正在使用 ${manager} 安装依赖...`).start();

    const child = spawn(manager, [command], {
        cwd: targetPath,
        env: process.env,
    });

    if (!child) {
        console.error('子进程创建失败');
        return;
    }
    // 监听子进程的标准输出（stdout）
    child.stdout.on('data', (data) => {
        // spinner.text(data.toString()) // 将npm的输出
    });

    // 监听子进程的标准错误输出（stderr）
    child.stderr.on('data', (data) => {
        spinner.fail(data.toString());// 将npm的错误输出
    });

    // 监听子进程错误事件
    child.on('error', (error) => {
        console.error('启动安装进程出错:', error);
        spinner.fail('启动安装进程出错');
    });

    // 监听子进程的结束事件
    child.on('close', (code) => {
        if (code === 0) {
            spinner.succeed('依赖安装成功!')
            console.log(chalk.green(`执行${manager} run dev 运行项目`));
        } else {
            spinner.fail(`安装过程中出错，退出码：${code}`)
        }
    });
}
