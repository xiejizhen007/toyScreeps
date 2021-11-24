export default class TerminalExtension extends StructureTerminal {
    public work(): void {
        this.buyPower();        
    }

    public buyPower(): boolean {
        return false;
    }
};