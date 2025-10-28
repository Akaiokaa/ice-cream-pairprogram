import express from 'express';

const app = express();

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));
// Enable static file serving (client side file that does not communicate with database)
app.use(express.static('public'));
const orders = [];
const PORT = 3002;

app.get('/admin', (req,res) =>{
    res.render('admin', {orders})
})
app.get('/confirmation', (req, res) => {
    res.render('confirmation');
})
app.get('/', (req, res) => {
    res.render('home');
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.post('/submit-order', (req, res) => {
    // console.log(req.body);
    // res.render(`${import.meta.dirname}/views/confirmation.html`);
    const dateOrdered = new Date();
    const order = {
        name: req.body.name,
        cone: req.body.cone,
        toppings: req.body.toppings,
        comments: req.body.comments,
        timestamp: dateOrdered.toLocaleString()
    };
    // //const prder = req.body; order.fname
    orders.push(order);
    console.log(orders);
    // // console.log(orders);
    // res.render('confirmation', {order: order
    // });
    res.render('confirmation');
});