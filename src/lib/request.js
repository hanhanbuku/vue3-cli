import axios from 'axios'

axios.interceptors.response.use((res)=>{
    return res.data
})

/**
 * 获取远端模板
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getRepoList = ()=>{
    return axios.get('https://api.github.com/repos/hanhanbuku/vue3_template/branches')
}
