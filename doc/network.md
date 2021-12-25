# Network

## GlobalNetwork

### TerminalNetwork

### MarketNetwork

### FactoryNetwork

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

持续孵化 `Creep`

#### TowerNetwork

#### SourceNetwork

围绕 `Source` 组成的网络，包括 source, link/container。

主要工作：

- 发布能量采集任务，能量传输任务
- 在没有 `Link` 的情况下，需要发布能量回收任务
- 定时检测能量采集情况，避免没人采集

#### MiningNetwork

围绕 `Mineral` 组成的网络，包括 Mineral, container。

#### UpgradeNetwork

升级专用网，包括 controller, link/container。
