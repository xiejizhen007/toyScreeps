import { Global } from "Global/Global";
import { Mem } from "Mem";
import { Priority } from "setting";

export interface MarketMemory {
    buy: {
        room: string;
        resourceType: ResourceConstant;
        amount: number;     // 需要购买的数量，当然取决于市场订单
        tick: number;       // 处理超时
    }[];

    sell: {
        room: string;
        resourceType: ResourceConstant;
        amount: number;     // 需要购买的数量，当然取决于市场订单
        tick: number;       // 处理超时
    }[];
}

export const MarketMemoryDefaults: MarketMemory = {
    buy: [],
    sell: [],
}

export class Market {
    memory: MarketMemory;
    
    constructor() {
        
        this.memory = Mem.wrap(Memory.global, 'market', MarketMemoryDefaults);
        Global.market = this;
    }

    init() {

    }

    work() {

    }

    registerRequest(type: string,room: string, resourceType: ResourceConstant, amount: number) {
        const targetRoom = Game.rooms[room];
        if (targetRoom && targetRoom.terminal && targetRoom.terminal.my && (type == ORDER_BUY || type == ORDER_SELL)) {
            const buy = type == ORDER_BUY;
            if (buy) {
                // 找卖的最便宜的
                const orders = Game.market.getAllOrders({type: ORDER_SELL, resourceType: resourceType});
                const minPrice = _.min(orders, o => o.price);
                const minAmount = _.min([amount, minPrice.amount, targetRoom.terminal.store.getFreeCapacity()]);

                if (Game.market.credits > minPrice.price * minAmount) {
                    if (targetRoom.terminal.store[RESOURCE_ENERGY] > Game.market.calcTransactionCost(minAmount, targetRoom.name, minPrice.roomName)) {
                        Game.market.deal(minPrice.id, minAmount, targetRoom.name);
                    } else {
                        const roomNetwork = Global.roomNetworks[targetRoom.name];
                        if (roomNetwork) {
                            roomNetwork.commandCenter.transportNetwork.requestInput(roomNetwork.terminal, Priority.Normal, {
                                resourceType: resourceType,
                                amount: 800
                            });
                        }
                    }
                }
            }
        } else {
            return ERR_INVALID_ARGS;
        }
    }
}