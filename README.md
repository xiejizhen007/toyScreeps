# toyScreeps

一个玩具级的 screeps 代码，纯玩具，目前未实行自动化

typeScript 的配置请参考[这里](https://www.jianshu.com/p/895f05016ff2)

项目安装

```bash
npm install
```

借鉴了大佬的[代码](https://github.com/HoPGoldy/my-screeps-ai)

## 重构 1.0

尝试模仿 om，似乎不太成功。代码耦合性较高，无法通用。

当前代码

- Lab 能用
- Link 能用
- Factory 还没动工
- 暂未实现资源共享，但可通过手操实现资源共享...
- 无外矿模块
- PowerCreep 有一个基本的任务模块，但依赖于房间内其他部件
- 玩具任务队列，功能甚少，还不好用
- 能挖 power，但内部逻辑比较混乱
