
export type Venue = {
  id: number;
  name: string;
  location: string;
  price: number;
  latitude: number;
  longitude: number;
  image: string;
  tag: string;
};

export const venues: Venue[] = [
  {
    id: 1,
    name: "Dhuku Sports Hub",
    location: "Kathmandu, Nepal",
    price: 1800,
    latitude: 27.7172,
    longitude: 85.324,
    image: "/venues/1.jpg",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Bhaktapur Futsal",
    location: "Suryabinayak, Bhaktapur",
    price: 2000,
    latitude: 27.671,
    longitude: 85.4298,
    image: "/venues/2.jpg",
    tag: "Local venue",
  },
  {
    id: 3,
    name: "Pulchowk Sports Hub",
    location: "Pulchowk, Lalitpur",
    price: 1500,
    latitude: 27.6766,
    longitude: 85.3188,
    image: "/venues/3.jpg",
    tag: "Explore",
  },
];
