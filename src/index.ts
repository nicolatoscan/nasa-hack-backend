// express backend api
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import * as bodies from './body';
import { generateCropSuggestionPrompt } from './utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { config } from 'dotenv'
config();

const client_id = "b4445e9a-c1ac-4722-8eac-78c989762552"
const client_secret = process.env.SENTINEL_SECRET!

async function getAuthAxios(): Promise<AxiosInstance> {
  const ax = axios.create({ baseURL: "https://services.sentinel-hub.com" })
  const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } }
  const body = qs.stringify({ client_id, client_secret, grant_type: "client_credentials" });
  const resp = (await ax.post("/auth/realms/main/protocol/openid-connect/token", body, config))
  Object.assign(ax.defaults, { headers: { authorization: `Bearer ${resp.data.access_token}`,
    'Content-Type': 'application/json' } })
  return ax;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.post('/campoColorato', async (req: Request, res: Response) => {
  const body = bodies.getColorBody(+req.body.latitude, +req.body.longitude)
  try {
    const response = await (await getAuthAxios()).post('/api/v1/process', body, { responseType: 'arraybuffer' });
    res.set({ 'Content-Type': 'image/jpeg' });
    res.send(response.data);
  } catch (e) { console.log(e) }
});


app.post('/campoMoisture', async (req: Request, res: Response) => {
  const body = bodies.getMoisture(+req.body.latitude, +req.body.longitude)
  try {
    const response = await (await getAuthAxios()).post('/api/v1/process', body, { responseType: 'arraybuffer' });
    res.set({ 'Content-Type': 'image/jpeg' });
    res.send(response.data);
  } catch (e) { console.log(e) }
});

app.post('/vegetation', async (req: Request, res: Response) => {
  const body = bodies.getVegetation(+req.body.latitude, +req.body.longitude)
  try {
    const response = await (await getAuthAxios()).post('/api/v1/process', body, { responseType: 'arraybuffer' });
    res.set({ 'Content-Type': 'image/jpeg' });
    res.send(response.data);
  } catch (e) { console.log(e) }
});

app.post('/reflectance', async (req: Request, res: Response) => {
  const body = bodies.getReflectance(+req.body.latitude, +req.body.longitude)
  try {
    const response = await (await getAuthAxios()).post('/api/v1/process', body, { responseType: 'arraybuffer' });
    res.set({ 'Content-Type': 'image/jpeg' });
    res.send(response.data);
  } catch (e) { console.log(e) }
});


app.post('/suggestions', async (req: Request, res: Response) => {
  const prompt = generateCropSuggestionPrompt(req.body.weatherData)
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {

    const result = await model.generateContent(prompt);
    let json = (result.response.text() as any).replaceAll("```", "").replace("json", "");
    const r = JSON.parse(json) as { name: string, description: string }[];
    res.send(r);
  } catch (e) { console.log(e) }
})


app.listen(3003, () => {
  console.log('Server running on port 3000');
});