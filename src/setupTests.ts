import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// This adds custom jest matchers from jest-dom
import '@testing-library/jest-dom'

const mockRaffle = {
  _id: '1',
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

export const handlers = [
  http.get('*/api/raffles', () => {
    return HttpResponse.json([mockRaffle])
  }),

  http.post('*/api/raffles', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      {
        ...mockRaffle,
        ...body,
        _id: '1'
      },
      { status: 201 }
    )
  }),

  http.get('*/api/raffles/:id', ({ params }) => {
    return HttpResponse.json({
      ...mockRaffle,
      _id: params.id
    })
  })
]

export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
