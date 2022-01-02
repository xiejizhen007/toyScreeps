import { FactoryNetwork } from "./FactoryNetwork";
import { MarketNetwork } from "./MarketNetwork";
import { TerminalNetwork } from "./TerminalNetwork";

export class GlobalNetwork {
    factoryNetwork: FactoryNetwork;
    marketNetwork: MarketNetwork;
    terminalNetwork: TerminalNetwork;
    
    constructor() {
        this.factoryNetwork = new FactoryNetwork();
        this.marketNetwork = new MarketNetwork();
        this.terminalNetwork = new TerminalNetwork();
    }
}