"use server";
import { z } from "zod";
import { leadSchema } from "./types";

const API_URL = process.env.API_URL;

export const findLeads = async (keyword: string, location: string) => {
  const res = await fetch(`${API_URL}/v1/scraper/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, location }),
  });

  if (!res.ok) throw new Error("Unable to find leads");

  const data = await res.json();
  const leads = z.array(leadSchema).parse(data);

  return leads;
};
