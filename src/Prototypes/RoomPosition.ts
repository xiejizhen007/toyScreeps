RoomPosition.prototype.findClosestByLimitedRange = function <T>(objects: T[] | RoomPosition[], rangeLimit: number,
                                                                opts: { filter: any | string; }): T | undefined {
    const objectInRange = this.findInRange(objects, rangeLimit, opts);
    return this.findClosestByRange(objectInRange, opts);
}