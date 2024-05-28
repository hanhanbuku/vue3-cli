// 配置自定义选项
export default [
    {
        name: 'lang',
        type: 'list',
        // 提示信息
        message: '请选择js或ts模板',
        // 选项
        choices: [
            {name: 'js', value: 'js'},
            {name: 'ts', value: 'ts'},
        ],
    },
    {
        name: 'ui',
        type: 'list',
        // 提示信息
        message: '请选择ui库',
        // 选项
        choices: [
            {name: 'element-ui', value: 'element-plus'},
            {name: 'antd', value: 'ant-design-vue'},
            {name:'不使用UI库',value: false}
        ],
    },
    {
        name: 'checkRouter',
        type: 'list',
        // 提示信息
        message: '是否安装vue-router',
        // 选项
        choices: [
            {name: '是', value: true},
            {name: '否', value: false},
        ],
    },
    {
        name: 'checkAxios',
        type: 'list',
        // 提示信息
        message: '是否安装Axios',
        // 选项
        choices: [
            {name: '是', value: true},
            {name: '否', value: false},
        ],
    },
    {
        name: 'checkVuex',
        type: 'list',
        // 提示信息
        message: '是否安装Vuex',
        // 选项
        choices: [
            {name: '是', value: true},
            {name: '否', value: false},
        ],
    }
]
