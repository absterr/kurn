import type { LeadQuery, LeadQueryForm } from "@/lib/schema/lead-schema";

export const mockLeadQueries = [
  {
    id: "f55d5806-55f8-41a4-afa6-7bd5e719ea05",
    keyword: "Coffee shops",
    location: "Abuja",
    status: "processing",
    resultsCount: 10,
    createdAt: "2026-05-01T08:30:00Z",
    updatedAt: "2026-06-03T14:22:10Z",
  },
  {
    id: "3118a180-cacf-4448-93c3-4392f87b2746",
    keyword: "Hotels",
    location: "Austin, TX",
    status: "pending",
    resultsCount: 10,
    createdAt: "2026-04-15T11:00:00Z",
    updatedAt: "2026-05-28T09:45:33Z",
  },
  {
    id: "371a4ac1-915e-4d7f-a636-e83b43abdb89",
    keyword: "Bakeries",
    location: "Lagos",
    status: "successful",
    resultsCount: 10,
    createdAt: "2026-03-20T16:15:00Z",
    updatedAt: "2026-04-10T12:00:00Z",
  },
  {
    id: "5ccc6407-dcc3-41c2-a8a1-fea90d513ba2",
    keyword: "Pharmacies",
    location: "Abuja",
    status: "successful",
    resultsCount: 10,
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-05-18T11:30:00Z",
  },
  {
    id: "b7d0973c-5a29-43ff-8e53-aecc48d0284d",
    keyword: "Gyms",
    location: "Port Harcourt",
    status: "pending",
    resultsCount: 10,
    createdAt: "2026-06-01T07:45:00Z",
    updatedAt: "2026-06-01T07:45:00Z",
  },
  {
    id: "dec02d89-4591-45c1-8406-5630e0cd51ef",
    keyword: "Law firms",
    location: "Lekki, Lagos",
    status: "processing",
    resultsCount: 10,
    createdAt: "2026-05-25T13:20:00Z",
    updatedAt: "2026-06-02T16:00:00Z",
  },
  {
    id: "c2743fac-0f92-4af4-8f89-7d3233893556",
    keyword: "Real estate agents",
    location: "Abuja",
    status: "successful",
    resultsCount: 88,
    createdAt: "2026-04-05T10:10:00Z",
    updatedAt: "2026-04-20T08:55:00Z",
  },
  {
    id: "d72cf59a-ce02-4227-8ab2-e0ba721daf96",
    keyword: "Car dealerships",
    location: "Ibadan",
    status: "failed",
    resultsCount: 10,
    createdAt: "2026-05-18T15:00:00Z",
    updatedAt: "2026-05-18T15:42:00Z",
  },
  {
    id: "db0caaed-f3c3-4d6c-8db7-9ed44f1711e6",
    keyword: "Dental clinics",
    location: "Enugu",
    status: "successful",
    resultsCount: 10,
    createdAt: "2026-03-30T12:00:00Z",
    updatedAt: "2026-04-02T09:10:00Z",
  },
  {
    id: "8af4bc0e-7d8a-43a7-bd89-fc919fce525b",
    keyword: "Event halls",
    location: "Kano",
    status: "processing",
    resultsCount: 10,
    createdAt: "2026-06-03T06:30:00Z",
    updatedAt: "2026-06-03T18:00:00Z",
  },
];

export const createMockLeadQuery = (body: LeadQueryForm): LeadQuery => ({
  id: crypto.randomUUID(),
  keyword: body.keyword,
  location: body.location,
  status: "pending",
  resultsCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getLeadQuery = (queryId: string, queries: LeadQuery[]) => {
  return queries.find((l) => l.id === queryId);
};

export const isDuplicate = (body: LeadQueryForm, queries: LeadQuery[]) =>
  queries.some(
    (q) =>
      q.keyword.toLowerCase() === body.keyword.toLowerCase() &&
      q.location.toLowerCase() === body.location.toLowerCase(),
  );
