import { db } from "../database/database.connection.js";


export async function postCustomers(req, res) {

  const { name, phone, cpf, birthday } = req.body;

  if(!name){ 
    return res.status(400).send(err.message)};

  try {   
    const checkCPF = await db.query(`SELECT cpf FROM customers WHERE cpf = $1`, 
    [cpf])

    if (checkCPF.rowCount > 0){
      return res.status(409).send(err.message)
    };

    await db.query(`
    INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, 
    [name, phone, cpf, birthday]);

    return res.sendStatus(201);    
  }
  catch (error) {
    return res.status(500).send(err.message)
  };
};


export async function getIdCustomers(req, res) {

  const { id } = req.params;

  try {
    const idCustomer = await db.query("SELECT id, name, phone, cpf, TO_CHAR(birthday::DATE, 'yyyy-mm-dd') AS birthday FROM customers WHERE id = $1", [
      id,
    ]);

    if (idCustomer.rowCount === 0) {
      return res.status(404).send(res.message);
    }

    return res.status(200).send(idCustomer.rows[0]);
  } 
  catch (err) {
    return res.status(500).send(err.message)
  }
} 


export async function getCustomers(req, res){

  try {
      const customers = await db.query(
        `SELECT id, name, phone, cpf, TO_CHAR(birthday::DATE, 'yyyy-mm-dd') AS birthday FROM customers`)

      return res.send(customers.rows)
    } 
    catch (err) {
      return res.status(500).send(err.message)
    };
} ;



export async function putCustomers(req, res) {

  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

    if(!name){ 
    return res.status(400).send(err.message);}

    try{
    const checkCustomer = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id != $2`, 
    [cpf, id])

    if (checkCustomer.rowCount > 0){
      return res.status(409).send(err.message)
    }

    await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, 
    [name, phone, cpf, birthday, id])

      return res.sendStatus(200); 
    }
    catch (err){
      return res.status(500).send(err.message)
    }
}