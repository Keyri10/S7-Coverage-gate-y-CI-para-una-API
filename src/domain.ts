import type { Reservation, TimeInterval } from './types.ts'

export function assertValidCapacity(capacity: number): void {
    if (capacity <= 0) {
        throw new Error('La capacidad debe ser mayor a 0')
    }
}

export function assertValidInterval(start: Date, end: Date): void {
    if (start.getTime() >= end.getTime()) {
        throw new Error('El inicio debe ser menor que el fin')
    }
}

export function assertValidAttendees(attendees: number, capacity: number): void {
    if (attendees <= 0) {
        throw new Error('Los asistentes deben ser mayor a 0')
    }

    if (attendees > capacity) {
        throw new Error('Los asistentes superan la capacidad de la sala')
    }
}

export function intervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
    return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime()
}

export function hasActiveOverlap(interval: TimeInterval, reservations: Reservation[]): boolean {
    return reservations.some(
        (reservation) =>
            reservation.status === 'active' &&
            intervalsOverlap(interval, { start: reservation.start, end: reservation.end })
    )
}
