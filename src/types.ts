export type ReservationStatus = 'active' | 'cancelled'

export interface TimeInterval {
    start: Date
    end: Date
}

export interface Room {
    id: string
    name: string
    capacity: number
}

export interface Reservation {
    id: string
    roomId: string
    start: Date
    end: Date
    responsible: string
    attendees: number
    status: ReservationStatus
}
