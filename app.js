import express from 'express';

const app = express();

// Enable static file serving (client side file that does not communicate with database)
app.use(express.static('public'));

const PORT = 3002;

app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})