var express = require("express");
var app = express();
var crypto = require("crypto");
require("dotenv").config();
var router = require("express").Router();
const { Deta } = require("deta");
const deta = Deta(process.env.DETA_KEY);
let db = deta.Base("proxpi");
let dbAnalytics = deta.Base("analytics");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { encrypt } = require("../core/crypt");
app.use(cors());

router.route("/create").post(async (req, res) => {
  const createdProxpi = await db.put({
    email: req.body.email,
    method: req.body.body.method,
    name: req.body.body.name + crypto.randomBytes(2).toString("hex"),
    url: req.body.body.url,
    access: req.body.body.access,
    privateUrl: "",
    header: encrypt(JSON.stringify({})),
    body: {},
    resp_time: [],
    data: {},
    params: {},
    site_access: [],
    blocked_site: [],
    blocked_ip: [],
    daily: {},
    geo: [],
    status: [],
    error_log: [],
    requests_log: [],
  });

  if (createdProxpi) {
    res.send({ statusb: true });
  } else {
    res.send({ status: false });
  }
});

module.exports = router;
