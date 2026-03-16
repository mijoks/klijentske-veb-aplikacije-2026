export interface OrderModel {
    toyId: number;
    name: string;
    price: number;
    count: number;
    typeId: number;
    targetGroup: string;
    createdAt: number; 
    status: 'r' | 'p' | 'o'; 
    rating?: number; 
}