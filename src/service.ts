import {
    assertValidAttendees,
    assertValidCapacity,
    assertValidInterval,
    hasActiveOverlap
} from './domain.ts'
import { InMemoryReservationRepository } from './repository.ts'
import type { Reservation, Room } from './types.ts'

export class ReservationService {
    private nextRoomId = 1
    private nextReservationId = 1

    constructor(private readonly repository: InMemoryReservationRepository) {}

    registerRoom(name: string, capacity: number): Room {
        assertValidCapacity(capacity)

        const room: Room = {
            id: `room-${this.nextRoomId++}`,
            name,
            capacity
        }

        this.repository.saveRoom(room)
        return room
    }

    createReservation(input: {
        roomId: string
        start: Date
        end: Date
        responsible: string
        attendees: number
    }): Reservation {
        assertValidInterval(input.start, input.end)

        const room = this.repository.findRoomById(input.roomId)

        if (!room) {
            throw new Error('Sala no encontrada')
        }

        assertValidAttendees(input.attendees, room.capacity)

        const existing = this.repository.findReservationsByRoomId(input.roomId)

        if (hasActiveOverlap({ start: input.start, end: input.end }, existing)) {
            throw new Error('El horario se traslapa con una reservación activa')
        }

        const reservation: Reservation = {
            id: `res-${this.nextReservationId++}`,
            roomId: input.roomId,
            start: input.start,
            end: input.end,
            responsible: input.responsible,
            attendees: input.attendees,
            status: 'active'
        }

        this.repository.saveReservation(reservation)
        return reservation
    }

    cancelReservation(id: string): Reservation {
        const reservation = this.repository.findReservationById(id)

        if (!reservation) {
            throw new Error('Reservación no encontrada')
        }

        const cancelled: Reservation = { ...reservation, status: 'cancelled' }
        this.repository.saveReservation(cancelled)
        return cancelled
    }

    isAvailable(roomId: string, start: Date, end: Date): boolean {
        assertValidInterval(start, end)

        const room = this.repository.findRoomById(roomId)

        if (!room) {
            throw new Error('Sala no encontrada')
        }

        const existing = this.repository.findReservationsByRoomId(roomId)
        return !hasActiveOverlap({ start, end }, existing)
    }
}
