# Network

## GlobalNetwork

### TerminalNetwork

各房间之间的资源共享，记录各个房间的资源状况。

主要工作

- 当 A 房间缺少资源了，如能量，矿物等，向该网络注册需要的资源类型与数量。
- 检查注册的资源请求，如果存在足够多的资源，处理该请求。

### MarketNetwork

### FactoryNetwork

### WarNetwork

矛与盾。主动防御，进攻等。

## RoomNetwork

### LinkNetwork

房间内的 `Link` 传输网。

`LinkNetwork` 里有 `receiveLinks`、`transportLinks`，一个负责接收能量，一个负责传输能量。

使用 `LinkNetwork` 的接口可以将 `link` 注册为发送能量的一方或者是接收能量的一方。

### LabNetwork

### CenterNetwork

### TransportNetwork

### BaseNetwork

房间内的基础设施，维护房间的运行

#### SpawnNetwork

持续孵化 `Creep`。

为 `creep` 们提供孵化的接口。

#### TowerNetwork

#### SourceNetwork

围绕 `Source` 组成的网络，包括 source, link/container。

主要工作：

- 发布能量采集任务，能量传输任务
- 在没有 `Link` 的情况下，需要发布能量回收任务
- 定时检测能量采集情况，避免没人采集

#### MiningNetwork

围绕 `Mineral` 组成的网络，包括 Mineral, container。

检查 `mineral` 的采集情况，适当的孵化 `creep`。

#### UpgradeNetwork

升级专用网，包括 controller, link/container。
