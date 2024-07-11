export interface CarInterface {
    id: number;
    brand: string;
    model: string;
    price: number;
    year: Date| string;
    reserved?: boolean;
}
