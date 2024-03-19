const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');
const app = express();
require('dotenv').config({ path: "./.env" });

app.use(express.json());
app.use(express.urlencoded({extended: false})); 
user_ = process.env.USERID;
password_ = process.env.PASSWORD;
openAIKey = process.env.OPENAI;
const uri = `mongodb+srv://${user_}:${password_}@cluster0.aoju68d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection

      console.log("You successfully connected to MongoDB!");
      
    } catch(err){
        console.log('Error: ', err);    

    }
  }
  run().catch(console.dir).then(() => {
    app.listen(3000, () => {
        console.log('Server is running at port 3000');
    });
  })

  async function getEmbedding(query) {
    // Define the OpenAI API url and key.
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = openAIKey; // Replace with your OpenAI key.
    
    // Call OpenAI API to get the embeddings.

    let response = await axios.post(url, {
        input: query,
        model: "text-embedding-3-small"
    }, {
        headers: {
            'Authorization': `Bearer ${openai_key}`,
            'Content-Type': 'application/json'
        }
    });
    
    if(response.status === 200) {
        return response.data.data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
}
app.get('/', (req, res) => {
    res.send('Hello world');
  });

app.get('/movies', async(req, res) => {
    try{
        movies = await client.db("sample_mflix").collection("movies").findOne();
        res.status(200).json({movies: movies});
    }catch(err){
        console.log('Error: ', err);
        res.status(500).json({error: err.message});

    }
})
app.get('/search_semantic', async(req, res) => {
    try {
        if (req.query.word) {
            embedding = await getEmbedding(req.query.word);
            results = await client
              .db("sample_mflix")
              .collection("embedded_movies")
              .aggregate([
                {"$vectorSearch": {
                  "queryVector": embedding,
                  "path": "plot_embedding",
                  "numCandidates": 100,
                  "limit":100,
                  "index": "vector_index",
                    }},
                {
                  "$project": {
                    "title": 1,
                    "plot": 1,
                    "score": {
                      "$meta": "searchScore"
                    }
                  
                  }
                }
                
              ])
              .toArray();
    
            return res.send(results);
          
        }
    }
        catch(err){
            console.log('Error: ', err);
            res.status(500).json({error: err.message});
        }
});
app.get('/search_auto', async(req, res) => {
    try {
        if (req.query.word) {
            results = await client
              .db("sample_mflix")
              .collection("movies")
              .aggregate([
                {
                  $search: {
                    index: "autocomplete",
                    autocomplete: {
                      query: req.query.word,
                      path: "title",
                      fuzzy: {
                        maxEdits: 1,
                      },
                      tokenOrder: "sequential",
                    },
                  },
                },
                {
                  $project: {
                    title:1,
                  },
                },
                
              ])
              .toArray();
    
            return res.send(results);
          
        }
    }
        catch(err){
            console.log('Error: ', err);
            res.status(500).json({error: err.message});
        }
});

