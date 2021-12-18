# toyScreeps

## Creep

## Room

## Structure

### StructureLink

Link 能将`能量`远距离传送至房间内另外一个 Link 中。

`LinkNetwork` 是房间内 `Link` 的服务网络，负责 `Link` 能量的传输。

### StructureLab

Lab 能够利用基础矿物合成高级化合物，或者将高级化合物还原为反应底物，也能 boost creep 和 unboost creep。

`LabGroup` 是房间内的 `Lab` 实现，负责进行 `Lab` 的基本操作。

## Flag

## 任务

### 运输任务

`TransportTask` 负责短距离资源的运输，主要通过 `Creep` 运送

`TerminalTask` 负责各个房间之间的资源传输，主要通过 `terminal` 运送。

### 房间工作任务
