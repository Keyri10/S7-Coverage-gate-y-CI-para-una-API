import type { Reservation, Room } from './types.ts'

export class InMemoryReservationRepository {
    private rooms = new Map<string, Room>()
    private reservations = new Map<string, Reservation>()

    saveRoom(room: Room): void {
        this.rooms.set(room.id, room)
    }

    findRoomById(id: string): Room | undefined {
        return this.rooms.get(id)
    }

    saveReservation(reservation: Reservation): void {
        this.reservations.set(reservation.id, reservation)
    }

    findReservationById(id: string): Reservation | undefined {
        return this.reservations.get(id)
    }

    findReservationsByRoomId(roomId: string): Reservation[] {
        return [...this.reservations.values()].filter((reservation) => reservation.roomId === roomId)
    }
}
