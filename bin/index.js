#! /usr/bin/env node

import {Command} from "commander";
import chalk from "chalk";
import Creator from "../lib/creator.js";
import path from 'path'

const program = new Command();

program
    .command('create <app-name>')  // 创建脚手架的命令
    .description('创建一个新项目') // 命令的描述
    .action((name,options,cmd)=>{
        // console.log(name,options,cmd,'执行create命令')
        // 获取工作目录
        const cwd = process.cwd();
        // 目标目录也就是要创建的目录
        const targetDir = path.join(cwd, name);
        console.log(targetDir,33333)
        // 初始化下载器
        const creator = new Creator(name, targetDir);
        creator.create()
    })

program.on('--help',()=>{
    console.log();
    console.log(`Run ${chalk.cyan('rippi <command> --help')} to show detail of this command`);
    console.log();
})

program.on('-v',()=>{
    console.log();
    console.log('1.0.0');
    console.log();
})



// 解析用户执行命令传入的参数
program.parse(process.argv);
