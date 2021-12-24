# toyScreeps

## TODO

`Creep`:

- 移动优化

`PowerCreep`:

- 移动优化（似乎没太大必要）
- 检查技能冷却

`Tower`:

- 只用一个塔修路
- 被入侵时，发现敌方奶量十足，转去修墙，或者治疗我方 `Creep`

`Lab`:

- 优化 `Lab` 逻辑，使其能够 `boost` 的同时进行反应
- 检测产物的数量，达到目标数量后继续合成用于打架的 `t3`

`Link`:

- 把 `Link` 用起来

`Factory`:

- 用起来

`Terminal`:

- 建立资源共享网络

## Memory

TODO: 尝试使用统一的接口，方便修改

## Creep

## Room

## Structure

### StructureLink

Link 能将`能量`远距离传送至房间内另外一个 Link 中。

`LinkNetwork` 是房间内 `Link` 的服务网络，负责 `Link` 能量的传输。

### StructureLab

Lab 能够利用基础矿物合成高级化合物，或者将高级化合物还原为反应底物，也能 boost creep 和 unboost creep。

`LabNetwork` 是房间内的 `Lab` 实现，负责进行 `Lab` 的基本操作。

### StructureTower

`TowerNetwork` 负责房间内的道路维护，防御等。

## Flag

## PowerCreep

## 任务

### 运输任务

`TransportTask` 负责短距离资源的运输，主要通过 `Creep` 运送。

`TerminalTask` 负责各个房间之间的资源传输，主要通过 `terminal` 运送。

### 房间工作任务

## overmind

记录 `overmind` 的设计方法，思路。

### 任务的派发与接收

对于 `Creep` 最基本的操作，`overmind` 基本都设计成 `任务 Task` 的形式。

#### 传输任务抽象 TransportRequestGroup

输入输出任务的请求、获取优先任务。

#### queen
