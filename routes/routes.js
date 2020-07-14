const express = require('express');
const transactionRouter = express.Router();
const TransactionModel = require('../models/TransactionModel.js');

//CREATE
transactionRouter.post('/', (req, res) => {
  try {
    const { description, value, category, year, month, day, type } = req.body;

    const transaction = new TransactionModel({
      description: description,
      value: value,
      category: category,
      year: year,
      month: month,
      day: day,
      yearMonth: `${year}-${month < 10 ? `0${month}` : month}`,
      yearMonthDay: `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`,
      type: type,
    });

    transaction.save();

    res.send(transaction);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

//RETRIEVE
transactionRouter.get('/', async (req, res) => {
  const { period } = req.query;

  if (period.length !== 7) {
    res.status(500).send({
      error:
        'É necessário informar o parâmetro "/period/", cujo valor deve estar no formato yyyy-mm',
    });
  }
  try {
    const filter = {
      yearMonth: period,
    };

    const data = await TransactionModel.find(filter);

    const countDocuments = data.length;

    if (!data) {
      res
        .status(404)
        .send({ message: 'Documentos não encontrados na coleção' });
      return;
    }

    res.send({
      length: countDocuments,
      transactions: data,
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

//UPDATE
transactionRouter.put('/:id', async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazios',
    });
  }

  const id = req.params.id;

  try {
    const data = await TransactionModel.findByIdAndUpdate(
      { _id: id },
      req.body
    );

    if (!data) {
      res.send(`Transaction id: ${id} nao encontrada`);
      return;
    }

    res.send({ message: 'Transaction atualizado com sucesso' });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Erro ao atualizar a Transaction id: ${id}` });
  }
});

//DELETE
transactionRouter.delete('/:id', async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para exclusão vazios',
    });
  }

  const id = req.params.id;

  try {
    const data = await TransactionModel.findByIdAndDelete({ _id: id });

    if (!data) {
      res.send(`Transaction id: ${id} nao encontrada`);
      return;
    }

    res.send({ message: 'Transaction excluída com sucesso' });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Erro ao excluir a Transaction id: ${id}` });
  }
});

module.exports = transactionRouter;
