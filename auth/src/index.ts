import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅✅✅ AUTH SERVICE is listening on port ${PORT} ✅✅✅`);
});
