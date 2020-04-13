import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  // eslint-disable-next-line class-methods-use-this
  public getBalance(): Balance {
    const income = this.transactions.reduce(
      (accu, { type, value }) => (type === 'income' ? accu + value : accu),
      0,
    );
    const outcome = this.transactions.reduce(
      (accu, { type, value }) => (type === 'outcome' ? accu + value : accu),
      0,
    );
    const balance = { income, outcome, total: income - outcome };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw Error("You don't have enough balance to complete this transaction");
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
