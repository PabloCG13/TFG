module.exports = app => {
    const addresses = require("../controllers/address.controller.js");

    var router = require("express").Router();

    // Create an address
    router.post("/addresses/", addresses.create);

    // Get all addresses
    router.get("/addresses/", addresses.findAll);

    // Get one address by its addressId
    router.get("/addresses/:addressId", addresses.findOne);

    // Get one address by its participantId
    router.get("/addresses/participant/:participantId", addresses.getAddressByParticipant);

    // Get one address that is currently free
    router.get("/addresses/any-participant/null-participant", addresses.getNullParticipant);

    // Update an address by its id
    router.put("/addresses/:addressId", addresses.update);

    // Delete an address by its id
    router.delete("/addresses/:addressId", addresses.delete);

    // Register routes under /api
    app.use('/api', router);
};
