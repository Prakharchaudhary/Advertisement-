const express = require("express");
const upload = require ("../utils/multer")

const { 
Indivisual_Partner_Signup,Indivisual_Partner_Otp_verify,Indivisual_Partner_Login,registerIndividualPartner 

} = require("../controllers/indivisual_partner_controller");

const router = express.Router();

router.post("/signup", Indivisual_Partner_Signup);
router.post("/otp_verify/:_id",Indivisual_Partner_Otp_verify );
router.post("/login", Indivisual_Partner_Login);
router.post(
      "/register",
      upload.fields([
        { name: "aadhaar_front_image", maxCount: 1 },
        { name: "aadhaar_back_image", maxCount: 1 },
      ]),
      registerIndividualPartner
    );
    




module.exports = router;
