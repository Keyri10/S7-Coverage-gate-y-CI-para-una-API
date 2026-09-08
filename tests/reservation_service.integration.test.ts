import { beforeEach, describe, expect, test } from 'vitest'
import { InMemoryReservationRepository } from '../src/repository.ts'
import { ReservationService } from '../src/service.ts'

const at = (hour: number, minute = 0) =>
    new Date(`2026-09-07T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`)

let service: ReservationService

beforeEach(() => {
    service = new ReservationService(new InMemoryReservationRepository())
})

describe('ReservationService with InMemoryReservationRepository', () => {
    test('registers a room and creates a reservation', () => {
        // Given
        const room = service.registerRoom('Sala A', 10)

        // When
        const reservation = service.createReservation({
            roomId: room.id,
            start: at(10),
            end: at(12),
            responsible: 'Ana',
            attendees: 6
        })

        // Then
        expect(reservation.roomId).toBe(room.id)
        expect(reservation.status).toBe('active')
        expect(reservation.responsible).toBe('Ana')
        expect(reservation.attendees).toBe(6)
    })

    test('rejects a reservation that overlaps an active one', () => {
        // Given
        const room = service.registerRoom('Sala A', 10)
        service.createReservation({
            roomId: room.id,
            start: at(10),
            end: at(12),
            responsible: 'Ana',
            attendees: 4
        })

        // Then
        expect(() =>
            service.createReservation({
                roomId: room.id,
                start: at(11),
                end: at(13),
                responsible: 'Luis',
                attendees: 3
            })
        ).toThrow('El horario se traslapa con una reservación activa')
    })

    test('allows the same interval again after cancelling', () => {
        // Given
        const room = service.registerRoom('Sala A', 10)
        const reservation = service.createReservation({
            roomId: room.id,
            start: at(10),
            end: at(12),
            responsible: 'Ana',
            attendees: 4
        })

        // When
        service.cancelReservation(reservation.id)
        const replacement = service.createReservation({
            roomId: room.id,
            start: at(10),
            end: at(12),
            responsible: 'Luis',
            attendees: 5
        })

        // Then
        expect(replacement.status).toBe('active')
        expect(replacement.responsible).toBe('Luis')
    })

    test('reports availability as true or false for an interval', () => {
        // Given
        const room = service.registerRoom('Sala A', 10)
        service.createReservation({
            roomId: room.id,
            start: at(10),
            end: at(12),
            responsible: 'Ana',
            attendees: 4
        })

        // When
        const occupied = service.isAvailable(room.id, at(10), at(12))
        const free = service.isAvailable(room.id, at(12), at(14))

        // Then
        expect(occupied).toBe(false)
        expect(free).toBe(true)
    })

    test('rejects availability when the room does not exist', () => {
        // Given
        const repository = new InMemoryReservationRepository()
        const serviceWithoutRooms = new ReservationService(repository)

        // When
        const checkAvailability = () =>
            serviceWithoutRooms.isAvailable('room-inexistente', at(10), at(12))

        // Then
        expect(checkAvailability).toThrow('Sala no encontrada')
    })
})
