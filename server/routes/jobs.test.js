//  const request = require("supertest")
//  const {expect} = require("chai")
//  const db = require("APP/db")
//  const {Employer, Skill, Job} = db
//  const app = require("../start")
//
//  /* global describe it before afterEach */
//
//  describe("/api/jobs", () => {
//    before("Await database sync", () => db.didSync)
//    afterEach("Clear the tables", () => db.truncate({ cascade: true }))
//
//    beforeEach("creates a job associated with employer and skills", () => {
//      Employer.create({
//        name: "Etsy",
//        company_site: "https://www.etsy.com"
//      })
//
//      Skill.create({
//        title: "sass",
//        template: true
//      })
//    })
//
//   describe("POST", () => {
//     it("returns the new job eager loaded with employer and skills", () =>
//       request(app)
//       .post("/api/jobs")
//       .send({
//        job: {
//          title: "JS Dev",
//          description: "Build me a million dollar app.",
//          remote: false,
//          employment_types: ["Full Time"],
//          pay_rate: "N/A",
//          compensation: "80-100K",
//          travel_requirements: "N/A",
//          employer_id: 1,
//        },
//        skills: [1]
//       })
//       .expect(201)
//     )
//   })
//
// })
