import colors from "colors"
import cors from "cors"
import * as dotenv from "dotenv"
import express from "express"
import { Configuration, OpenAIApi } from "openai"

const port = process.env.PORT || 5000

//* CONFIGURATION *//
dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const app = express()

// ENABLE BODY PARSER
app.use(cors())

app.use(express.json())

//* ROUTES *//
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CODEX!",
  })
})

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })
    res.status(200).send({
      bot: response.data.choices[0].text,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})

app.listen(port, () => {
  console.log(
    colors.cyan.bold.underline.italic(
      `Server running on http://localhost:${port}`
    )
  )
})
