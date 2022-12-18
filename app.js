import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/api/v1/watch', (req, res) => {
  try {
    const currentDate = new Date().toDateString()
    const currentTime = new Date().toTimeString()
    console.log(`Accessed on ${currentDate} at ${currentTime}.`);
    res.status(200).json({
      status: 'successful',
      currentDate,
      currentTime,
    });
  } catch (err) {
    console.log(err);
  }
});

export default app;
