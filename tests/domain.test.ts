import { describe, expect, test } from 'vitest'
import {
    assertValidAttendees,
    assertValidCapacity,
    assertValidInterval,
    hasActiveOverlap,
    intervalsOverlap
} from '../src/domain.ts'
import type { Reservation } from '../src/types.ts'

const at = (hour: number, minute = 0) =>
    new Date(`2026-09-07T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`)

const reservation = (overrides: Partial<Reservation> = {}): Reservation => ({
    id: 'res-1',
    roomId: 'room-1',
    start: at(10),
    end: at(12),
    responsible: 'Ana',
    attendees: 4,
    status: 'active',
    ...overrides
})

describe('assertValidCapacity', () => {
    test('rejects capacity 0', () => {
        // Given
        const capacity = 0

        // Then
        expect(() => assertValidCapacity(capacity)).toThrow('La capacidad debe ser mayor a 0')
    })

    test('rejects negative capacity', () => {
        // Given
        const capacity = -3

        // Then
        expect(() => assertValidCapacity(capacity)).toThrow('La capacidad debe ser mayor a 0')
    })

    test('accepts the minimum valid capacity of 1', () => {
        // Given
        const capacity = 1

        // Then
        expect(() => assertValidCapacity(capacity)).not.toThrow()
    })
})

describe('assertValidInterval', () => {
    test('rejects an interval whose start equals its end', () => {
        // Given
        const start = at(10)
        const end = at(10)

        // Then
        expect(() => assertValidInterval(start, end)).toThrow('El inicio debe ser menor que el fin')
    })

    test('rejects an interval whose start is after its end', () => {
        // Given
        const start = at(12)
        const end = at(10)

        // Then
        expect(() => assertValidInterval(start, end)).toThrow('El inicio debe ser menor que el fin')
    })

    test('accepts an interval whose start is before its end', () => {
        // Given
        const start = at(10)
        const end = at(11)

        // Then
        expect(() => assertValidInterval(start, end)).not.toThrow()
    })
})

describe('assertValidAttendees', () => {
    test('accepts attendees equal to room capacity', () => {
        // Given
        const attendees = 8
        const capacity = 8

        // Then
        expect(() => assertValidAttendees(attendees, capacity)).not.toThrow()
    })

    test('rejects attendees above room capacity', () => {
        // Given
        const attendees = 9
        const capacity = 8

        // Then
        expect(() => assertValidAttendees(attendees, capacity)).toThrow(
            'Los asistentes superan la capacidad de la sala'
        )
    })

    test('rejects zero attendees', () => {
        // Given
        const attendees = 0
        const capacity = 8

        // Then
        expect(() => assertValidAttendees(attendees, capacity)).toThrow(
            'Los asistentes deben ser mayor a 0'
        )
    })
})

describe('intervalsOverlap', () => {
    test('detects a partial overlap', () => {
        // Given
        const current = { start: at(10), end: at(12) }
        const incoming = { start: at(11), end: at(13) }

        // When
        const overlap = intervalsOverlap(current, incoming)

        // Then
        expect(overlap).toBe(true)
    })

    test('detects a contained overlap', () => {
        // Given
        const current = { start: at(10), end: at(14) }
        const incoming = { start: at(11), end: at(12) }

        // When
        const overlap = intervalsOverlap(current, incoming)

        // Then
        expect(overlap).toBe(true)
    })

    test('detects a total overlap', () => {
        // Given
        const current = { start: at(10), end: at(12) }
        const incoming = { start: at(10), end: at(12) }

        // When
        const overlap = intervalsOverlap(current, incoming)

        // Then
        expect(overlap).toBe(true)
    })

    test('allows adjacent intervals', () => {
        // Given
        const current = { start: at(10), end: at(12) }
        const incoming = { start: at(12), end: at(14) }

        // When
        const overlap = intervalsOverlap(current, incoming)

        // Then
        expect(overlap).toBe(false)
    })
})

describe('hasActiveOverlap', () => {
    test('does not block a slot occupied only by a cancelled reservation', () => {
        // Given
        const interval = { start: at(10), end: at(12) }
        const reservations = [reservation({ status: 'cancelled' })]

        // When
        const blocked = hasActiveOverlap(interval, reservations)

        // Then
        expect(blocked).toBe(false)
    })
})
