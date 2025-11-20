import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));
// Enable static file serving (client side file that does not communicate with database)
app.use(express.static('public'));
const orders = [];
const PORT = 3009;

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

app.get('/db-test', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch (err){
        console.error('Database error:', err)
        res.status(500).send('Database error: ' + err.message);
    }
})

app.get('/admin', async (req,res) =>{
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC'); 
        res.render('admin', {orders})
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

app.get('/confirmation', async (req, res) => {
    res.render('confirmation', {orders});
})
app.get('/', (req, res) => {
    res.render('home');
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.post('/confirm', async (req, res) => {
    // console.log(req.body);
    // res.render(`${import.meta.dirname}/views/confirmation.html`);
    try {
        const order = req.body;
        console.log('New order submitted: ', order);

        order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";

        const sql = `INSERT INTO orders (customer, email, flavor, cone, toppings) VALUES (?, ?, ?, ?, ?)`;
        const params = [
            order.name,
            order.email,
            order.flavor,
            order.cone,
            order.toppings
        ];
        const [result] = await pool.execute(sql, params);
        console.log('Order saved with ID:', result.insertId);
        res.render('confirmation', {order})
    } catch (err){
        console.error('Error processing order:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
    // const dateOrdered = new Date();
    // const order = {
    //     timestamp: dateOrdered.toDateString(),
    //     name: req.body.name,
    //     email: req.body.email,
    //     cone: req.body.cone,
    //     flavor: req.body.flavor,
    //     toppings: req.body.toppings,
    //     comments: req.body.comments
    // };
    // // //const prder = req.body; order.fname
    // orders.push(order);
    // console.log(orders);
    // // // console.log(orders);
    // // res.render('confirmation', {order: order
    // // });
    // res.render('confirmation', {orders});
});