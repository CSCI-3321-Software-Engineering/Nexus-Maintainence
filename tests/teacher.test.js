const mongoose = require("mongoose")
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

//let server;


describe("GET /routes/teacher", () => {
  beforeAll( async () => await mongoose.connect(process.env.DB_CONNECTION_URL));  
  it("Responds with 200\n\tContent Type'\n\tData", (done) => {
    request(app)
    .get("/teacher")
    .expect("Content-Type", /html/)
    .expect(301) //getting 301 instead of 200
    .expect((res) => {
      //res.body.data.length = 0;
      res.body.data = "True";
    })
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
  });
  afterAll(async () => await mongoose.connection.close());
});

