export enum ChargeState {
    FULL = "FULL",
    EMPTY = "EMPTY",
    STORAGE = "STORAGE"
}

export type Item = {
    id: number;
    name: string;
    category: number;
    amount: number;
    dateBought: string | undefined;
    chargeState: ChargeState | undefined;
    bundles: number[];
}