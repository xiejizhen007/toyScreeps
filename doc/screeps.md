---
title: Screeps
tags: screeps game
---

## ToyScreeps

### 目标

实现 `screeps` 的半自动化，解放双手。
主要包括资源共享，资源采集，自动布局等。

### Kernel

全局对象，掌管全局的 Role 和 RoomNetwork。

### Role

Role 是对 Creep 的扩展，也是处理房间事务的基本单位。

#### RoleCarry

RoleCarry 主要携带 `CARRY` 和 `MOVE`，负责房间内物质的运输，比如将 `energy` 从 `Source` 处送往 `Storage`。

#### RoleWork

RoleWork 主要携带 `WORK`，负责采集能量，采集矿物，升级等等。

<!-- #### RoleWar -->

### RoomNetwork

`RoomNetwork` 是以 `room` 为基本单位的对象，主要完成房间内的基本工作。

#### Defence（TODO）

负责房间内的防御，操控 `Tower`，并按需发布主动防御

#### LinkNetwork（已完结）

`Link` 传输网络，分为 `LinkInput`,`LinkOutput`。

对于需要使用 `Link` 的模块，需要将模块上的 `Link` 注册为接收方、发送方。
对于没有发送目标的发送方，将能量送到中央单元 `commandCenter`。

#### LogisticSystem

房间内的物流系统，向房间内各模块提供资源调度的接口。

```ts
class LogisticSystem {
    insert(task);
    remove(task);
}
```
