const express = require("express");
const router = express.Router();
const uid = require("uid");

const authorization = containerDependency.get("authService").authMiddleware;
const houseModel = containerDependency.get("houseModel");
const imageManager = containerDependency.get("imageService");

router.get("/", (req, res, next) => {
  houseModel
    .findAll(HousesResponse.showAllHouses)
    .then(({ info, status }) => {
      res.status(status).json(info);
    })
    .catch(({ error, status }) => {
      res.status(status).json(error);
    });
});

router.get("/main", (req, res, next) => {
  const location = req.query.city || '';
  const limit = Number(req.query.limit) || 20;

  houseModel
    .findWithLimit(location, limit, HousesResponse.showAllHouses)
    .then(({ info, status }) => {
      res.status(status).json(info);
    })
    .catch(({ error, status }) => {
      res.status(status).json(error);
    });
});

router.get("/search", (req, res, next) => {
  const city = req.query.city || '';
  const country = req.query.country || '';
  const price = (req.query.price && req.query.price.split("-")) || '';
  const type = req.query.type || '';
  const roomsQty = req.query.rooms || '';
  const limit = Number(req.query.limit) || 20;

  houseModel
    .find(req, HousesResponse.showAllHouses)
    .then(({ info, status }) => {
      res.status(status).json(info);
    })
    .catch(({ error, status }) => {
      res.status(status).json(error);
    });
});

router.get("/geolocation", (req, res, next) => {
  const coordinates = { x: req.query.x, y: req.query.y };
  const maxDistance = req.query.maxDistance;
  const filter = req.query.filter;

  houseModel
    .findByLocation(
      coordinates,
      maxDistance,
      filter,
      HousesResponse.showAllHouses
    )
    .then(({ info, status }) => {
      res.status(status).json(info);
    })
    .catch(({ error, status }) => {
      res.status(status).json(error);
    });
});

router.get("/id/:id", (req, res, next) => {
  const id = req.params.id; //sh3yfelxzkyvuh9cb3q8 for test

  houseModel
    .findById(id, HousesResponse.showSpecificHouse)
    .then(({ info, status }) => {
      res.status(status).json(info);
    })
    .catch(({ error, status }) => {
      res.status(status).json(error);
    });
});

//No olvidar añadir el token
router.post("/add_houses", (req, res, next) => {
  const dataToSave = req.body;
  dataToSave.public_id = uid(20);

  try {
    houseModel
      .saveInfo(dataToSave)
      .then(({ info, status }) => {
        res.status(status).json({ public_id: info.public_id });
      })
      .catch(({ error, status }) => {
        res.status(status).json(error);
      });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/add_house_images", async (req, res, next) => {
  const imagesToSave = Object.values(req.files);
  const userId = req.body.userId;
  const houseId = req.body.houseId;
  const folder = `users/${userId}/houses/${houseId}/`;
  
  const images = await imageManager.uploadImages(imagesToSave, folder);
  const transformImage = await houseModel.editInfo({ public_id: houseId }, { resources: { photos: images.info }});
  res.status(200).json(transformImage);
});

router.post("/edit_house", (req, res, next) => {
  const filter = req.body.filter;
  const dataUpdate = req.body.update;

  houseModel
    .editInfo(filter, dataUpdate)
    .then(({ info, status }) => {
      res.status(status).json(info);
    })
    .catch(({ error, status }) => {
      res.status(status).json(error);
    });
});

// router.post('/add_houses', authorization, (req, res, next) => {
//   const reportMissingArgument = () => res.status(400).json({error: "missing argument"})
//   console.log("Post de añadir casas")
//   const
// });

router.get("/verifyToken", authorization, (req, res, next) => {
  res.send("Token is ok");
});

module.exports = router;
