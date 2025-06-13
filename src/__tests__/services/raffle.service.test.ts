import { describe, it, expect } from 'vitest'
import { getRaffles, getRaffleById, saveRaffle } from '@/services/raffle.service'
import type { Raffle } from '@/types'
import { server } from '@/setupTests'
import { http, HttpResponse } from 'msw'

const mockRaffle: Omit<Raffle, '_id'> = {
  id: '1',
  title: 'Test Raffle',
  description: 'Test Description',
  prize: 'Test Prize',
  minNumber: 1,
  maxNumber: 100,
  ticketPrice: 3000,
  status: 'active',
  selectedNumbers: [],
  selectedNumbersQuantity: 0
}

describe('Raffle Service', () => {
  describe('getRaffles', () => {
    it('should fetch all raffles', async () => {
      const raffles = await getRaffles()
      
      expect(Array.isArray(raffles)).toBe(true)
      expect(raffles.length).toBeGreaterThan(0)
      const raffle = raffles[0]
      expect(raffle).toHaveProperty('_id')
      expect(raffle).toHaveProperty('title')
      expect(raffle).toHaveProperty('description')
      expect(raffle).toHaveProperty('prize')
      expect(raffle).toHaveProperty('minNumber')
      expect(raffle).toHaveProperty('maxNumber')
      expect(raffle).toHaveProperty('ticketPrice')
      expect(raffle).toHaveProperty('status')
      expect(raffle).toHaveProperty('selectedNumbers')
      expect(raffle).toHaveProperty('selectedNumbersQuantity')
    })

    it('should handle errors when fetching raffles fails', async () => {
      server.use(
        http.get('*/api/raffles', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(getRaffles()).rejects.toThrow('Failed to get raffles')
    })
  })

  describe('getRaffleById', () => {
    it('should fetch a raffle by id', async () => {
      const raffleId = '1'
      const raffle = await getRaffleById(raffleId)

      expect(raffle).toHaveProperty('_id', raffleId)
      expect(raffle.title).toBe(mockRaffle.title)
      expect(raffle.description).toBe(mockRaffle.description)
      expect(raffle.prize).toBe(mockRaffle.prize)
      expect(raffle.minNumber).toBe(mockRaffle.minNumber)
      expect(raffle.maxNumber).toBe(mockRaffle.maxNumber)
      expect(raffle.ticketPrice).toBe(mockRaffle.ticketPrice)
      expect(raffle.status).toBe(mockRaffle.status)
      expect(raffle.selectedNumbers).toEqual(mockRaffle.selectedNumbers)
      expect(raffle.selectedNumbersQuantity).toBe(mockRaffle.selectedNumbersQuantity)
    })

    it('should handle errors when fetching a raffle fails', async () => {
      const raffleId = 'invalid-id'
      
      server.use(
        http.get(`*/api/raffles/${raffleId}`, () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(getRaffleById(raffleId)).rejects.toThrow('Failed to get raffle')
    })
  })

  describe('saveRaffle', () => {
    it('should save a new raffle', async () => {
      const savedRaffle = await saveRaffle(mockRaffle as Raffle)

      expect(savedRaffle).toHaveProperty('_id')
      expect(savedRaffle.title).toBe(mockRaffle.title)
      expect(savedRaffle.description).toBe(mockRaffle.description)
      expect(savedRaffle.prize).toBe(mockRaffle.prize)
      expect(savedRaffle.minNumber).toBe(mockRaffle.minNumber)
      expect(savedRaffle.maxNumber).toBe(mockRaffle.maxNumber)
      expect(savedRaffle.ticketPrice).toBe(mockRaffle.ticketPrice)
      expect(savedRaffle.status).toBe(mockRaffle.status)
      expect(savedRaffle.selectedNumbers).toEqual(mockRaffle.selectedNumbers)
      expect(savedRaffle.selectedNumbersQuantity).toBe(mockRaffle.selectedNumbersQuantity)
    })

    it('should handle errors when saving a raffle fails', async () => {
      server.use(
        http.post('*/api/raffles', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(saveRaffle(mockRaffle as Raffle)).rejects.toThrow('Failed to save raffle')
    })
  })
})
