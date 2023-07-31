import { db } from "../database/database.connection.js";


export async function postRentals(req, res){
    
    const {customerId, gameId, daysRented} = req.body;

    if (!Number.isInteger(daysRented) || daysRented <= 0) {
      return res.sendStatus(400);
    }

    try{   
      const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, 
      [customerId])
      if(customer.rowCount === 0){
        return res.sendStatus(400);
      };

      const game = await db.query(`"SELECT * FROM games WHERE id = $1"`, 
      [gameId])
      if(game.rowCount === 0){
        return res.sendStatus(400);
      };

      const { stockTotal, pricePerDay } = game.rows[0];

      const gameRental = await db.query(
        'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL',
        [gameId])
      if (gameRental.rowCount >= stockTotal) {
        return res.sendStatus(400);
      };

      const rentDate = new Date().toISOString().slice(0, 10);
      const originalPrice = pricePerDay * daysRented;

      const rentalDate = [
        customerId,
        gameId,
        rentDate,
        daysRented,
        null,
        originalPrice,
        null,
      ];
  
      await db.query(
        `
        INSERT INTO rentals (
          "customerId",
          "gameId",
          "rentDate",
          "daysRented",
          "returnDate",
          "originalPrice",
          "delayFee"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        rentalDate
      )

      return res.status(201).send(res.message);
    }
    catch{
      return res.status(500).send(err.message)
    }  
};



export async function postEndRentals(req, res){

  const id = req.params.id;

  try {
    const update = await db.query(`SELECT rentals.*, games."pricePerDay" AS "pricePerDay"
        FROM rentals 
        JOIN games ON games.id = rentals."gameId"
        WHERE rentals.id = $1
      `, [id]);

    if (update .rowCount === 0) {
      return res.sendStatus(404)
    };

    const rental = update.rows[0];

    if (rental.returnDate !== null) {
      return res.sendStatus(400)
    };

    const returnDate = new Date();
    const changeDate = Math.floor(
      (returnDate - new Date(rental.rentDate)) / (1000 * 60 * 60 * 24)
    );

    let delayFee = null;

    if (changeDate > rental.daysRented) {
      delayFee = (changeDate - rental.daysRented) * rental.pricePerDay;
    }

    await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [returnDate.toISOString().slice(0, 10), delayFee, id]
    );

    return res.sendStatus(200) 
  }
  catch{
    return res.status(500).send(err.message)
  }  
}


export async function getRentals(req, res){
  
  try {
    const getRental = await db.query(`SELECT rentals.*, TO_CHAR(rentals."rentDate", 'yyyy-mm-dd') AS "formattedRentDate",
      customers.name AS "customerName",
      games.name AS "gameName"
    FROM rentals
    JOIN customers ON customers.id = rentals."customerId"
    JOIN games ON games.id = rentals."gameId"
  `);

  const getList = getRental.rows.map((rental) => ({
    id: rental.id,
    customerId: rental.customerId,
    gameId: rental.gameId,
    rentDate: rental.formattedRentDate,
    daysRented: rental.daysRented,
    returnDate: rental.returnDate,
    originalPrice: rental.originalPrice,
    delayFee: rental.delayFee,
    customer: {
      id: rental.customerId,
      name: rental.customerName,
  },
    game: {
      id: rental.gameId,
      name: rental.gameName,
  },
  }))

  return res.send(getList);
  }  
  catch {
  return res.status(500).send(err.message)
  };
};


export async function deleteRentals(req, res){

  const id = req.params.id;

  try {
    const deleteRental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]
    );

    if (deleteRental.rowCount < 1) {
      return res.sendStatus(404)
    };

    if (deleteRental.rows[0].returnDate === null) {
      return res.sendStatus(400)
    };

    await db.query(`DELETE FROM rentals WHERE id=$1`,
      [id]);
    
    return res.sendStatus(200);
  }
  catch{
    return res.status(500).send(err.message)
  }

}