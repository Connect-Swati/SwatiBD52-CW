let express = require("express");
let app = express();
let port = 3000;
// Import the Track model and Sequelize instance from the previously defined paths
let track = require("./models/track.model");

let { sequelize } = require("./lib/index");
const { where } = require("sequelize");

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

let movieData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD5.2 - CW" });
});

// end point to see the db
app.get("/seed_db", async (req, res) => {
  try {
    // Synchronize the database, forcing it to recreate the tables if they already exist

    await sequelize.sync({ force: true });
    // Bulk create entries in the Track table using predefined data
    await track.bulkCreate(movieData);

    // Send a 200 HTTP status code and a success message if the database is seeded successfully
    res.status(200).json({ message: "Database Seeding successful" });
  } catch (error) {
    // Send a 500 HTTP status code and an error message if there's an error during seeding

    console.log("Error in seeding db", error.message);
    return res.status(500).json({
      code: 500,
      message: "Error in seeding db",
      error: error.message,
    });
  }
});

/*
Exercise 1: Fetch all tracks

Create an endpoint /tracks that’ll return all the tracks in the database.

Create a function named fetchAllTracks to query the database using the sequelize instance

API Call

http://localhost:3000/tracks

Expected Output:

{
  tracks: [
    // All the tracks in the database
  ],
}

*/

//function to fetch all tracks
async function fetchAllTracks() {
  try {
    let result = await track.findAll();
    if (!result || result.length == 0) {
      throw new Error("No tracks found");
    }
    return { tracks: result };
  } catch (error) {
    console.log("Error in fetching all tracks", error.message);
    return error;
  }
}

//endpoint to get all tracks
app.get("/tracks", async (req, res) => {
  try {
    let tracks = await fetchAllTracks();
    return res.status(200).json(tracks);
  } catch (error) {
    if (error.message == "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching all tracks",
        error: error.message,
      });
    }
  }
});

/*
Exercise 2: Fetch track details by ID

Create an endpoint /tracks/details/:id that’ll return track details based on the ID.

Declare a variable named id to store the path parameter passed by the user

Create a function named fetchTrackById to query the database using the sequelize instance

API Call

http://localhost:3000/tracks/details/2

Expected Output:

{
	'track': {
		'id':2,
		'name':'Naina Da Kya Kasoor',
		'artist':'Amit Trivedi',
		'album':'Andhadhun',
		'genre':'Pop',
		'duration':3,
		'release_year':2018
	}
}
*/

// function to fetch track details by id
async function fetchTrackById(id) {
  try {
    let result = await track.findOne({ where: { id: id } });

    /*
    track.findOne(): This is a Sequelize method used to retrieve the first entry that matches the query criteria. If no criteria are specified, it returns the first entry in the table.
    where:: This option is used to specify the conditions under which a record should be found. It acts like a WHERE clause in SQL.
    { id: id }: Specifies that Sequelize should look for a record in the track table where the id column matches the id provided. This is a JavaScript object where the property name id refers to the column name in your database, and the value id refers to the variable or value you are searching for.
    
    */

    if (!result) {
      throw new Error("No track found");
    }
    return { track: result };
  } catch (error) {
    console.log("Error in fetching track by id", error.message);
    throw error;
  }
}
// endpoint to get track details by id
app.get("/tracks/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let track = await fetchTrackById(id);
    return res.status(200).json(track);
  } catch (error) {
    if (error.message === "No track found") {
      return res.status(404).json({
        code: 404,
        message: "No track found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching track by id",
        error: error.message,
      });
    }
  }
});

/*
Exercise 3: Fetch all tracks by an artist

Create an endpoint /tracks/artist/:artist that’ll return all the tracks by an artist

Declare a variable named artist to store the path parameter passed by the user

Create a function named fetchTracksByArtist to query the database using the sequelize instance

API Call

http://localhost:3000/tracks/artist/Arijit%20Singh

Expected Output:

{
  tracks: [
    {
      id: 1,
      name: 'Raabta',
      artist: 'Arijit Singh',
      album: 'Agent Vinod',
      genre: 'Romantic',
      duration: 4,
      release_year: 2012,
    },
    {
      id: 6,
      name: 'Ghungroo',
      artist: 'Arijit Singh',
      album: 'War',
      genre: 'Dance',
      duration: 5,
      release_year: 2019,
    },
    {
      id: 9,
      name: 'First Class',
      artist: 'Arijit Singh',
      album: 'Kalank',
      genre: 'Dance',
      duration: 4,
      release_year: 2019,
    },
    {
      id: 10,
      name: 'Kalank Title Track',
      artist: 'Arijit Singh',
      album: 'Kalank',
      genre: 'Romantic',
      duration: 5,
      release_year: 2019,
    },
  ],
}

*/
// function to fetch tracks by artist
async function fetchTracksByArtist(artist) {
  try {
    let result = await track.findAll({
      where: {
        artist: artist,
      },
    });
    if (!result || result.length == 0) {
      throw new Error("No tracks found");
    }
    return { tracks: result };
  } catch (error) {
    console.log("Error in fetching tracks by artist", error.message);
    throw error;
  }
}
// endpoint to get tracks by artist
app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let tracks = await fetchTracksByArtist(artist);
    return res.status(200).json(tracks);
  } catch (error) {
    if (error.message == "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching tracks by artist",
        error: error.message,
      });
    }
  }
});

/*
Exercise 4: Sort all the tracks by their release year

Create an endpoint /tracks/sort/release_year that’ll return all the tracks sorted by their release year

Declare a variable named order to store the query parameter passed by the user

order can only hold asc OR desc

Create a function named sortTracksByReleaseYear to query the database using the sequelize instance

API Call

http://localhost:3000/tracks/sort/release_year?order=desc

Expected Output:

{
  tracks: [
    {
      id: 4,
      name: 'Bekhayali',
      artist: 'Sachet Tandon',
      album: 'Kabir Singh',
      genre: 'Rock',
      duration: 6,
      release_year: 2019,
    },
    {
      id: 5,
      name: 'Hawa Banke',
      artist: 'Darshan Raval',
      album: 'Hawa Banke (Single)',
      genre: 'Romantic',
      duration: 3,
      release_year: 2019,
    },
    {
      id: 6,
      name: 'Ghungroo',
      artist: 'Arijit Singh',
      album: 'War',
      genre: 'Dance',
      duration: 5,
      release_year: 2019,
    },
    {
      id: 7,
      name: 'Makhna',
      artist: 'Tanishk Bagchi',
      album: 'Drive',
      genre: 'Hip-Hop',
      duration: 3,
      release_year: 2019,
    },
    {
      id: 8,
      name: 'Tera Ban Jaunga',
      artist: 'Tulsi Kumar',
      album: 'Kabir Singh',
      genre: 'Romantic',
      duration: 3,
      release_year: 2019,
    },
    {
      id: 9,
      name: 'First Class',
      artist: 'Arijit Singh',
      album: 'Kalank',
      genre: 'Dance',
      duration: 4,
      release_year: 2019,
    },
    {
      id: 10,
      name: 'Kalank Title Track',
      artist: 'Arijit Singh',
      album: 'Kalank',
      genre: 'Romantic',
      duration: 5,
      release_year: 2019,
    },
    {
      id: 2,
      name: 'Naina Da Kya Kasoor',
      artist: 'Amit Trivedi',
      album: 'Andhadhun',
      genre: 'Pop',
      duration: 3,
      release_year: 2018,
    },
    {
      id: 3,
      name: 'Ghoomar',
      artist: 'Shreya Ghoshal',
      album: 'Padmaavat',
      genre: 'Traditional',
      duration: 3,
      release_year: 2018,
    },
    {
      id: 1,
      name: 'Raabta',
      artist: 'Arijit Singh',
      album: 'Agent Vinod',
      genre: 'Romantic',
      duration: 4,
      release_year: 2012,
    },
  ],
}
*/
// function to sort tracks by release year
async function sortTracksByReleaseYear(order) {
  try {
    /*
    In Sequelize, when you need to refer to column names in the context of sorting, filtering, or condition checks within methods like findAll, the column names should be enclosed in quotes to be treated as strings.
    */
    let result = await track.findAll({
      order: [["release_year", order]],
    });
    if (!result || result.length == 0) {
      throw new Error("No tracks found");
    }
    return { tracks: result };
  } catch (error) {
    console.log("Error in sorting tracks by release year", error.message);
    throw error;
  }
}
// endpoint to get tracks by release year
app.get("/tracks/sort/release_year", async (req, res) => {
  try {
    let order = req.query.order;
    let tracks = await sortTracksByReleaseYear(order);
    return res.status(200).json(tracks);
  } catch (error) {
    if (error.message == "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in sorting tracks by release year",
        error: error.message,
      });
    }
  }
});
