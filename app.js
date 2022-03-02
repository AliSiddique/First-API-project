const express  = require('express')
const PORT = process.env.PORT || 8000
const bodyParser = require('body-parser')
const app = express()
const cheerio = require('cheerio')
const axios = require('axios')
const newspapers = [
    {
        name:'theguardian',
        address:'https://www.theguardian.com/environment/climate-crisis'

    },
    {
        name:'thetimes',
        address:'https://www.thetimes.co.uk/environment/climate-change'
    }
]
app.use(bodyParser.json())

const articles= []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const data  = response.data
        const $ = cheerio.load(data)
        $('a:contains("climate")', data).each(function(){
         const title = $(this).text()
         const url = $(this).attr("href")
         articles.push({
            title,
            url
        })
        })
        
    })
   
})

app.get('/news', (req,res) => {
res.json(articles)
})


app.get('/news/:newspaperId', (req,res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    axios.get(newspaperAddress)
    .then(response => {
        const data = response.data
        const $ = cheerio.load(data)
        const specificArticles = []
        $('a:contains("climate")', data).each(function(){
            const title = $(this).text()
            const url = $(this).attr("href")

            specificArticles.push({
                title,
                url
            })

        })
        res.send(specificArticles)
    }).catch(error => console.log(error))

})

app.listen(PORT)