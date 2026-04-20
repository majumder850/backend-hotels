const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");

app.use(express.json());

initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function createHotel(newHotelData) {
  try {
    const hotel = new Hotel(newHotelData);
    const savedHotel = await hotel.save();
    return savedHotel;
  } catch (error) {
    throw error;
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);

    res.status(201).json({
      message: "Hotel added successfully.",
      hotel: savedHotel,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add hotel.",
    });
  }
});

// Question 1

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    if (hotels.length !== 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// Question 2

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ name: req.params.hotelName });
    if (hotel) {
      res.status(200).json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

// Question 3

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: req.params.phoneNumber });
    if (hotel) {
      res.status(200).json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

// Question 4

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const rating = parseFloat(req.params.hotelRating);
    const hotels = await Hotel.find({ rating: rating });
    if (hotels.length !== 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found with this rating." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// Question 5

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await Hotel.find({ category: req.params.hotelCategory });
    if (hotels.length !== 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found in this category." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function deleteHotelById(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    throw error;
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);

    if (deletedHotel) {
      res.status(200).json({
        message: "Hotel deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete hotel.",
    });
  }
});

async function updateHotelById(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    throw error;
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body);

    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        hotel: updatedHotel,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to update hotel.",
    });
  }
});

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Hotel API server running on port ${PORT}`);
// });

module.exports = app;
