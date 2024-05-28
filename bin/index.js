#! /usr/bin/env node

import {Command} from "commander";
import chalk from "chalk";
import Creator from "../src/lib/creator.js";
import path from 'path'
import inquirer from 'inquirer'
import Questions from "../src/lib/questions.js";
import fs from 'fs-extra'
import {filterFile} from "../src/lib/utils.js";


const program = new Command();

program
    .command('create <app-name>')  // 创建脚手架的命令
    .description('创建一个新项目') // 命令的描述
    .option('-d, --default', '跳过选项，使用默认配置')
    .option('-f, --force', '覆盖当前已存在的目录')
    .action(async (name,options,cmd)=>{
        // 获取工作目录
        const cwd = process.cwd();
        // 目标目录也就是要创建的目录
        const targetDir = path.join(cwd, name);
        // 先检测文件是否存在
        await filterFile(targetDir,options)
        // 询问是否自定义选项
        const anwser = await inquirer.prompt([
            {
                name: 'customerOrTemplate',
                type: 'list',
                // 提示信息
                message: '请选择使用模板还是自定义配置',
                // 选项
                choices: [
                    {name: '使用模板', value: 'template'},
                    {name: '自定义配置项', value: 'customer'},
                ],
            },
            {
                name: 'nodeModules',
                type: 'list',
                // 提示信息
                message: '请选择包管理器',
                // 选项
                choices: [
                    {name: 'npm', value: 'npm'},
                    {name: 'yarn', value: 'yarn'},
                    {name: 'pnpm', value: 'pnpm'},
                ],
            },
        ])
        // 如果选择直接使用模板
        if(anwser.customerOrTemplate==='template'){
            // 初始化下载器
            const creator = new Creator(name, targetDir);
            creator.createTemplate(anwser.nodeModules)
            return
        }
        // 添加一些自定义选项
        const customerAnwser = await inquirer.prompt(Questions)
        // 初始化下载器
        const creator = new Creator(name, targetDir);
        creator.create({...customerAnwser,nodeModules:anwser.nodeModules})
    })

program.on('--help',()=>{
    console.log();
    console.log(`Run ${chalk.cyan('rippi <command> --help')} to show detail of this command`);
    console.log();
})

program.version('1.0.5', '-v, --version')




// 解析用户执行命令传入的参数
program.parse(process.argv);
