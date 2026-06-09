async function searchLocation(req, res) {
  try {
    /*
    Here we have done 'req.query.q' because:
    1. In frontend, user types "Swayambhu" in location field and send request "GET /location/search?q=Swayambhu"
    2. That 'q=Swayambhu' - is a query string and in express query string lives in 'req.query' so we are extracting that value here  
    */
    const q = req.query.q;
    // If there is no query string
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&countrycodes=np&accept-language=en`,
      {
        method: "GET",
        // Here we have sent custom header called 'User-Agent' because Nominatim requires this header
        headers: {
          "User-Agent": "FutsalBookingWebApp",
        },
      },
    );
    const data = await response.json();
    // 'results' is an array of object which gets sent as a reponse to frontend which frontend consumes to show the location suggestion as user types the location
    const results = data.map((place) => ({
      lat: place.lat,
      lon: place.lon,
      display_name: place.display_name,
    }));

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { searchLocation };
