import ky from "ky";

ky.get("https://jsonplaceholder.typicode.com/todos/1")
  .json()
  .then((data) => console.log(data));
