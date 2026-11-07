import mysql2 from 'mysql2';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';    

const con = mysql2.createConnection({
    host: 'localhost', 
    user: 'root',
    database_port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

con.connect((err) => {
    if (err) console.error(`Can't connect: ${err}`); 
    else console.log('Database connected.');
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => console.log(`http://localhost:${port}`));

app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM product';
    let query = con.query(sql, (err, result) => {
        if (err) console.log('Something wrong');
        else return res.send(result);
    })
})


app.get('/api/products/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM product WHERE product_id = ${id}`;
    let query = con.query(sql, (err, result) => {
        if (err) console.log('Something wrong');
        else {
            console.log('Success');
            return res.send(result);
        }
    })
})

app.post('/api/products', (req, res) => {
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;
    let sql = `INSERT INTO product (product_name, product_price) VALUES ("${product_name}", ${product_price})`;
    let query = con.query(sql, (err, result) => {
        if (err) console.log('Something wrong');
        else {
            console.log('Succesfully updated');
            return res.send(result);
        }
    })
})

app.put('/api/products/:id', (req, res) => {
    const product_name = req.body.product_name;
    const product_price = req.body.product_price;
    const id = req.params.id;
    console.log(product_name);
    let sql = `UPDATE product SET product_name = "${product_name}", product_price = ${product_price} WHERE product_id = ${id}`;
    let query = con.query(sql, (err, result) => {
        if (err) console.log('Something wrong');
        else {
            console.log('Succesfully updated');
            return res.send(result);
        }
    })
})