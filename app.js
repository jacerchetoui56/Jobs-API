require('dotenv').config();
require('express-async-errors');

//*swagger setup
const swagger = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
//?this is for hosting : to avoid hosting problem , more on =>  https://www.npmjs.com/package/express-rate-limit
app.set('trust proxy', 1)
//db
const connectDB = require('./db/connect')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
const xssClean = require('xss-clean')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')

// routes
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')
app.use('/api/v1/jobs', jobsRouter)
app.use('/api/v1/auth', authRouter)

app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument))

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs" >API documentation</a>')
})

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
}))
app.use(helmet())
app.use(xssClean())


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
