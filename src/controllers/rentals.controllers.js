import { db } from "../database/database.connection.js";


export async function postRentals(req, res){
    
    const {customerId, gameId, daysRented} = req.body;

    try{
      
      const customer = await db.query(`SELECT "customerId" FROM rentals WHERE "customerId" = $1`, 
      [customerId])
      if(customer.rowCount === 0){
        return res.sendStatus(400);
      };

      const game = await db.query(`SELECT "gameId" FROM rentals WHERE "gameId" = $1`, 
      [gameId])
      if(game.rowCount === 0){
        return res.sendStatus(400);
      }

      return res.sendStatus(201);
    }
    catch{
      return res.status(500).send(err.message)
    }  
};



export async function postEndRentals(req, res){

  try{


    return res.sendStatus(200);
  }
  catch (err) {
      return res.status(500).send(err.message)
  };

}


export async function getRentals(req, res){

}


export async function deleteRentals(req, res){
  try{


    return res.sendStatus(200);
  }
  catch (err) {
      return res.status(500).send(err.message)
  };

}