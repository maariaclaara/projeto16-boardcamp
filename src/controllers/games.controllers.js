import  { db }  from "../database/database.connection.js";

export async function postGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  if(!name){ res.status(400).send(err.message); }

  if (stockTotal <= 0 || pricePerDay <= 0){
    res.status(400).send(err.message);
  }

  try {
    const name = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);

    if (name.rows.length > 0){
      res.status(409).send(err.message);
    }

    await db.query(`SELECT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay]);
    
    res.sendStatus(201);    
  } 
  catch (error) {
    res.status(500).send(err.message);
  }

}


  export async function getGames(req, res) {

    try {
      const games = await db.query(`SELECT * FROM games;`)
      res.send(games.rows)
    } 
    catch (err) {
      res.status(500).send(err.message)
    };

  };
