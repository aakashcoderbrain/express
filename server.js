const express = require('express');
const app = express();
const PORT = 4000;
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./dbconfig');

app.use(bodyParser.json());

app.post('/createUser', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = req.body;
    await usersCollection.insertOne(user);
    res.send({
      message: "User registered successfully",
      status: 200
    });
  } catch (error) {
    res.status(500).send({
      message: "Error registering user",
      error: error.message
    });
  }
});

app.post('/updateUser', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { user_name, ...updateFields } = req.body;
        if (!user_name) {
            return res.status(400).send({
                message: "Username is required",
                status: 400
            });
        }
        const existingUser = await usersCollection.findOne({ user_name });
        if (existingUser) {
            await usersCollection.updateOne(
                { user_name },
                { $set: updateFields }
            );
            res.send({
                message: "User updated successfully",
                status: 200
            }); 
        } else {
            await usersCollection.insertOne(req.body);
            res.send({
                message: "User created successfully",
                status: 201
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error updating user",
            error: error.message
        });
    }
});

app.delete('/deleteUser', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { user_name } = req.body;

        if (!user_name) {
            return res.status(400).send({
                message: "Username is required",
                status: 400
            });
        }
        const result = await usersCollection.deleteOne({ user_name });
        if (result.deletedCount === 1) {
            res.send({
                message: "User deleted successfully",
                status: 200
            });
        } else {
            res.status(404).send({
                message: "User not found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error deleting user",
            error: error.message
        });
    }
});

app.get('/findUser/:user_name', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { user_name } = req.params;

        if (!user_name) {
            return res.status(400).send({
                message: "Username is required",
                status: 400
            });
        }
        const user = await usersCollection.findOne({ user_name });
        if (user) {
            res.send({
                message: "User found",
                status: 200,
                user
            });
        } else {
            res.status(404).send({
                message: "User not found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error finding user",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
