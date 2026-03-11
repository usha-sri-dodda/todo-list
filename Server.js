const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'todo',
    port: 3306
});


app.get('/', (req, res) => {
    console.log('Default route');
    db.query('select * from todoitems ', (err, results) => {

        if(err) {
            console.error('Error fetching items:', err);
            return;
        }
        console.log('Items fetched successfully', results);
        res.send(results);
    });
});

app.post('/add-item', (req, res) => {
    console.log(req.body);
    db.query(`insert into todoitems(itemDescription) values('${req.body.text}')`,(err,results) =>{
        if(err) {
            console.error('Error inserting item:', err);
            return;
        }
        console.log('Item inserted successfully');
         res.json({
                insertId: results.insertId,
                itemDescription: req.body.text
            });
    })
       
});

app.put('/edit-item', (req, res) => {
    console.log('Line 45: ',req.body); 
    db.query(`update todoitems set itemDescription = '${req.body.itemDescription}' where Id = ${req.body.ID}`,(err,results) =>{
        if(err) {
            console.error('Error updating item:', err);
            return;
        }
        console.log('Item updated successfully');

    })
    res.send('Item updated successfully');
});

app.delete('/delete-item/:id', (req, res) => {

    const id = req.params.id;

    console.log("Deleting ID:", id);

    db.query(
        "DELETE FROM todoitems WHERE Id = ?",
        [id],
        (err, result) => {

            if (err) {
                console.error("Delete error:", err);
                return res.status(500).send(err);
            }

            console.log("Rows deleted:", result.affectedRows);

            res.json({
                message: "Item deleted successfully",
                affectedRows: result.affectedRows
            });
        }
    );
});
app.listen(3000, () => {
    // console.log('Server is running on port 3000');
});