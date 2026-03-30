import axios from "axios";
import { environment } from "../src/environments/environment.prod";

export const api = axios.create({
  baseURL: environment.apiUrl,
});
