import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/users/current-user', (req, res) => {
  res.send('Hello World');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅✅✅ AUTH SERVICE is listening on port ${PORT} ✅✅✅`);
});
