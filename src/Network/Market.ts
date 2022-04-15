import { Mem } from "Mem";

export interface MarketOrderCache {
    room: string,
    resourceType: ResourceConstant,
    amount: number,
    tick: number,
}

// 用于缓存订单，以防因为 terminal 能量不足
export interface MarketMemory {
    buy: MarketOrderCache[];
    sell: MarketOrderCache[];
}

export const MarketMemoryDefault: MarketMemory = {
    buy: [],
    sell: [],
};

export class Market implements IMarket {
    memory: MarketMemory;
    buyCache: MarketOrderCache[];
    sellCache: MarketOrderCache[];

    constructor() {
        this.memory = Mem.wrap(Memory, 'market', MarketMemoryDefault);
        this.buyCache = [];
        this.sellCache = [];
    }

    init(): void {
        this.buyCache = this.memory.buy;
        this.sellCache = this.memory.sell;
    }

    work(): void {
        _.remove(this.buyCache, r => r.tick + 2000 < Game.time || r.amount == 0);
        _.remove(this.sellCache, r => r.tick + 2000 < Game.time || r.amount == 0);

        _.forEach(this.buyCache, f => {
            this.buy(f.room, f.resourceType, f.amount);
        });
        
        _.forEach(this.sellCache, f => {
            this.sell(f.room, f.resourceType, f.amount);
        });
    }

    finish(): void {
        this.memory.buy = this.buyCache;
        this.memory.sell = this.sellCache;
    }

    /**
     * 购买资源
     * @param room 需要购买物资的房间
     * @param resourceType 物资类型
     * @param amount 数量
     * @param fast deal 单还是创建 buy 的订单，默认为 deal
     */
    buy(room: string, resourceType: ResourceConstant, amount: number, fast: boolean = true): number {
        if (!Game.rooms[room] || !Game.rooms[room].terminal) {
            return -1;
        }

        if (fast) {
            // deal 单，寻找价格最低的单子
            let orders = Game.market.getAllOrders({type: 'sell', resourceType: resourceType});
            orders = _.sortBy(orders, f => f.price);

            if (orders.length) {
                const cost = Game.market.calcTransactionCost(Math.min(amount, orders[0].amount), room, orders[0].roomName);
                const terminal = Game.rooms[room].terminal;
                const avgPrice = _.sum(Game.market.getHistory(resourceType), s => s.avgPrice) / 14;
                // console.log('当前平均价格: ' + avgPrice);

                if (orders[0].price > avgPrice * 2) {
                    console.log('当前价格过高: ' + orders[0].price);
                    return -1;
                }

                if (terminal.store['energy'] >= cost) {
                    if (terminal.cooldown == 0) {
                        _.remove(this.buyCache, r => r.room == room && r.resourceType == resourceType);
                        return Game.market.deal(orders[0].id, amount, room);
                    }
                } else {
                    Kernel.terminalNetwork.addRequest(room, 'energy', 1000 + Math.abs(cost - terminal.store['energy']));
                    
                    if (!_.find(this.buyCache, f => f.room == room && f.resourceType == resourceType)) {
                        this.buyCache.push({
                            room: room,
                            resourceType: resourceType,
                            amount: amount,
                            tick: Game.time,
                        });
                    }

                    return ERR_NOT_ENOUGH_ENERGY;
                }
            }
        } else {
            if (Game.market.credits <= 100000) {
                return ERR_NOT_ENOUGH_RESOURCES;
            }

            let orders = Game.market.getAllOrders({type: 'buy', resourceType: resourceType});
            orders = _.sortBy(orders, f => -f.price);
            const price = orders.length > 0 ? orders[0].price : Game.market.getHistory(resourceType)[0].avgPrice;

            if (!_.find(orders, f => f.roomName == room && f.resourceType == resourceType)) {
                return Game.market.createOrder({
                    type: 'buy',
                    resourceType: resourceType,
                    price: price,
                    totalAmount: amount,
                    roomName: room
                });
            }
        }

        return -1;
    }

    /**
     * 出售资源，fast 用于手操或者急于扔掉资源时
     * @param room 需要出售物资的房间
     * @param resourceType 物资类型
     * @param amount 数量
     * @param fast deal 单还是创建 sell 的订单，默认为 deal
     */
    sell(room: string, resourceType: ResourceConstant, amount: number, fast: boolean = true): number {
        if (fast) {
            let orders = Game.market.getAllOrders({type: 'buy', resourceType: resourceType});
            orders = _.sortBy(orders, f => -f.price);

            if (orders.length) {
                const terminal = Game.rooms[room].terminal;
                const realAmount = Math.min(amount, orders[0].amount, terminal.store[resourceType]);
                const cost = Game.market.calcTransactionCost(realAmount, room, orders[0].roomName);
                
                if (terminal.store['energy'] >= cost) {
                    if (terminal.cooldown == 0) {
                        _.remove(this.sellCache, r => r.room == room && r.resourceType == resourceType);
                        return Game.market.deal(orders[0].id, amount, room);
                    }
                } else {
                    Kernel.terminalNetwork.addRequest(room, 'energy', 1000 + Math.abs(cost - terminal.store['energy']));
                    
                    if (!_.find(this.sellCache, f => f.room == room && f.resourceType == resourceType)) {
                        this.sellCache.push({
                            room: room,
                            resourceType: resourceType,
                            amount: amount,
                            tick: Game.time,
                        });
                    }

                    return ERR_NOT_ENOUGH_ENERGY;
                }

            }
        } else {
            let orders = Game.market.getAllOrders({type: 'sell', resourceType: resourceType});
            orders = _.sortBy(orders, f => f.price);
            const price = orders.length > 0 ? orders[0].price : Game.market.getHistory(resourceType)[0].avgPrice;

            if (!_.find(orders, f => f.roomName == room && f.resourceType == resourceType)) {
                console.log('sell price: ' + orders[0].price);

                return Game.market.createOrder({
                    type: 'sell',
                    resourceType: resourceType,
                    price: price,
                    totalAmount: amount,
                    roomName: room
                });
            }
        }

        return -1;
    }
}