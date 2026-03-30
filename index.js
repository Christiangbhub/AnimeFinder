//initialize project (npm init -y)
//install express, axios and ejs via npm

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_URL = "https://api.jikan.moe/v4";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const randomNum = Math.floor(Math.random() * 10) + 1;
  try {
    const response = await axios.get(API_URL + "/anime/" + randomNum);
    const result = response.data;
    // console.log("images: " + JSON.stringify(response.data.data.images));
    res.render("index.ejs", { anime_data: result });
    // console.log(result.data.images.jpg.image_url);
  } catch (error) {
    res.render("index.ejs", { error: error.message });
  }
});

app.post("/search", async (req, res) => {
  //using axios to fetch api
  const userSearch = req.body.anime_name;
  try {
    const response = await axios.get(
      API_URL + "/anime?q=" + userSearch + "&type=tv",
    );
    // console.log(response.data);
    const result = response.data;
    const image_url = result.data[0].images.jpg.image_url;
    const anime_title = result.data[0].titles[0].title;
    const anime_status = result.data[0].status;
    const anime_synopsis = result.data[0].synopsis.split(".", 2);
    // console.log(anime_status);/
    const anime_eps = result.data[0].episodes;
    const data = {
      image: image_url,
      title: anime_title,
      status: anime_status,
      episodes: anime_eps,
      synopsis: anime_synopsis,
    };
    res.render("index.ejs", { search_data: data });
  } catch (error) {
    res.render("index.ejs", { error: error.message });
  }

  //   res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
