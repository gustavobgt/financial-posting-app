const express = require('express');
const transactionRouter = express.Router();
const TransactionModel = require('../models/TransactionModel.js');

transactionRouter.get('/', async (req, res) => {
  try {
    const { month, year } = req.body;

    const filter = {
      month: month,
      year: year,
    };

    const data = await TransactionModel.find(filter);

    if (!data) {
      res.status(404).send('Documentos não encontrados na coleção');
      return;
    }

    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

module.exports = transactionRouter;
