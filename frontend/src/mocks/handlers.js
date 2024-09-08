import { http, HttpResponse } from 'msw';

// Define initial static data
const staticData = [
  { type: 'bank-draft', title: 'Bank Draft', position: 0 },
  { type: 'bill-of-lading', title: 'Bill of Lading', position: 1 },
  { type: 'invoice', title: 'Invoice', position: 2 },
  { type: 'bank-draft-2', title: 'Bank Draft 2', position: 3 },
  { type: 'bill-of-lading-2', title: 'Bill of Lading 2', position: 4 },
];

// Define handlers
export const handlers = [
  http.get('/api/items', (req, res, ctx) => {
    // Fetch data from local storage if available
    const storedData = localStorage.getItem('items');
    if (storedData) {
      return res(ctx.json(JSON.parse(storedData)));
    }

		return HttpResponse.json(staticData)
  }),

  http.post('/api/items',async ({request})  => {
    const newData = await request.json();
    // Store data in local storage
    localStorage.setItem('items', JSON.stringify(newData));

		return HttpResponse.json(newData)
  }),
];
