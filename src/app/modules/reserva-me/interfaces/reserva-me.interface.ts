import { IClient, User } from "../../auth/interfaces";

export interface IReservation {
    id: number;
    userId: number;
    user: User;
    eventId: number;
    event: IEvent;
    reservedQuantity: number;
    status: number;
}

export interface ICreateReservation {
    userId: number;
    eventId: number;
    reservedQuantity: number;
    status?: number;
}

export interface IEvent {
    id: number;
    clientId: number;
    client: IClient;
    name: string;
    description: string;
    location: string;
    totalGuest: number;
    availableQuantity: number;
    date: Date;
    hour: Date;
    status: number;
    userAlreadyReserve?: boolean;
}

export interface IAvailableQuantity {
    availableQuantity: number;
}
