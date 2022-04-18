---
title: Screeps
tags: screeps game
---

## 目标

实现 `screeps` 的半自动化，解放双手。
主要包括资源共享，资源采集，自动布局等。

## Kernel

真全局变量（`global.Kernel`），拥有下游对象实例的哈希，如 `Role`, `RoomNetwork`, `Directive`。

实例化并初始化各个对象，如 `Role`, `RoomNetwork`, `Directive` 等，并完成各部件的功能调用。

## Role

Role 是对 Creep 的扩展，也是处理房间事务的基本单位。

### RoleCarry

RoleCarry 主要携带 `CARRY` 和 `MOVE`，负责房间内物质的运输，比如将 `energy` 从 `Source` 处送往 `Storage`。

### RoleWork

RoleWork 主要携带 `WORK`，负责采集能量，采集矿物，升级等等。

### RoleWar

## RoomNetwork

`RoomNetwork` 是以 `room` 为基本单位的对象，主要完成房间内的基本工作。

### Defence（TODO）

负责房间内的防御，操控 `Tower`，并按需发布主动防御

### LinkNetwork（已完结）

`Link` 传输网络，分为 `LinkInput`,`LinkOutput`。

对于需要使用 `Link` 的模块，需要将模块上的 `Link` 注册为接收方、发送方。
对于没有发送目标的发送方，将能量送到中央单元 `commandCenter`。

### LogisticSystem

房间内的物流系统，向房间内各模块提供资源调度的接口。

### LabCluster

实验室集群，实现资源合成，creep 强化。

### PCTaskSystem

PowerCreep 的任务系统。能够根据当前驻扎在房间内的 powerCreep 的能量进行任务的发布。

## Directive

`Directive` 是 flag 的拓展，继承 flag 的属性与方法。

```ts
abstract class Directive {
    abstract init(): void;
    abstract work(): void;
    abstract finish(): void;

    static create(pos, opts);
}
```

在房间模块中，通过调用 `Directive.create(pos: RoomPostion, opts)` 在 pos 的位置下发一条指令，
可以通过 opts 设置处理该指令的房间，*也可以后期自动设置处理指令的房间（暂未完成）*。
成功创建一条指令之后，向全局变量 Kernel 注册当前指令，并由 Kernel 完成指令的工作。

## Observer

## 创建建筑

因为不能有太多的建筑工地，所以需要一个对象管理创建建筑，避免工地过多。
首先的想法是，有一个全局的对象，控制着创建建筑的能力。
当有房间需要修建某种建筑时，该对象为房间创建建筑。

## 资源共享模块 terminal

### 情况一：某一房间需要获取某种资源

向资源申请表中注册当前申请。
检查资源分享表中有无当前的需要的资源，有的话转至情况三。

```ts
{
    room,
    resourceType,
    amount,
}
```

### 情况二：某一房间的资源过多，需要抛弃资源

向资源分享表中注册需要分享的资源。
检查是否有房间需要当前资源，有的话转至情况三。

```ts
{
    room,
    resourceType,
    amount,
}
```

### 情况三：房间 origin 向房间 target 发送物资

计划用于工厂的资源共享以及与向他人送物资。
发布任务，将对应资源搬到 origin 房间的终端。

```ts
{
    origin,
    target,
    resourceType,
    amount,
}
```
