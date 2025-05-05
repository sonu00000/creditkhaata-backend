const swaggerAutogen = require("swagger-autogen")()

const outputFile = "./swagger-output.json"
const endpointsFiles = ["./app.js"]

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log("Swagger documentation generated")
})
