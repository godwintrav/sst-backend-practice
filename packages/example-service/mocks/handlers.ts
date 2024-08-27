import { HttpHandler, HttpResponse } from "msw";
import { http } from "msw";

export const users = {
  page: 1,
  per_page: 6,
  total: 1,
  total_pages: 1,
  data: [
    {
      id: 1,
      email: "george.bluth@reqres.in",
      first_name: "George",
      last_name: "Bluth",
      avatar: "https://reqres.in/img/faces/1-image.jpg",
    },
  ],
};

export const handlers: HttpHandler[] = [
  http.get("https://reqres.in/api/users", () => {
    return HttpResponse.json(users);
  }),
  http.post(`https://l7skqvx4o6.execute-api.eu-west-1.amazonaws.com/lambda`, () => {
    return HttpResponse.json(users);
  }),
];

// export const postHandlers: HttpHandler[] = [
  
// ];
