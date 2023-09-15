import ora from 'ora';

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
