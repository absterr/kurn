interface Job {
  title: string;
  link: string;
  location: string;
  posted: string;
}

export type Lead = {
  id: number;
  name: string;
  mapLink: string;
  address: string;
  phone: string | undefined;
  website: string | undefined;
  emails: string[];
  linkedinUrl: string | undefined;
  overview: string | undefined;
  jobs: Job[] | undefined;
};
