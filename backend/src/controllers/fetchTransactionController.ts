import db from "../db/db";

const fetchTransactionFee = (hash: string) => {

}

const findTransactionInDb = (hash: string) =>
    db
        .query("SELECT * FROM transactions WHERE hash = ?")
        .get(hash);

const fetchTransactionFromEtherscan = (hash: string) => null