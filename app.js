const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// all players data using GET
app.get("/players/", async (request, response) => {
  const getAllPlayersQuery = `
        SELECT * FROM cricket_team
        ORDER BY player_id;
    `;
  const allPlayersDataArray = await db.all(getAllPlayersQuery);
  response.send(allPlayersDataArray);
});

// creates new player using POST

app.post("/players", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetailsQuery = `
        INSERT INTO
        cricket_team
        (player_name, jersey_number, role )
        VALUES
        (
            ${playerName},
            ${jerseyNumber},
            ${role}

        );
    `;
  await db.run(addPlayerDetailsQuery);
  response.send("Player Added to Team");
});
