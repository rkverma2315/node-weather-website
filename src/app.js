 const path = require ('path')
 const express = require ('express')
 const hbs = require ('hbs')
 //edited
 const geocode = require('./utils/geocode')
 const forecast = require('./utils/forecast')

 const app = express() 

 //Define path for express config
 const PublicPathDirectory = path.join(__dirname, '../public')
 const viewsPath = path.join(__dirname, '../templates/views')
 const partialPath = path.join(__dirname, '../templates/partials')
 app.use(express.static(PublicPathDirectory))

 // Setup handlebars engine and views location
 app.set('view engine', 'hbs')
 app.set('views', viewsPath)
 hbs.registerPartials(partialPath)

 // Setup static directory to serve or route handlers 
 app.get('', (req, res) => {
     res.render('index', {
        name: 'Ruchika',
        title: 'Weather'
     })
 })

 app.get('/about', (req, res) => {
     res.render('about', {
         title: 'About',
         name: 'Ruchika'
     })
 })
// app.get('', (req, res) => {
//     res.send('Hello Express!')
// })

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is my help page',
        title: 'Help',
        name: 'Ruchika'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Please provide a search term!'
        })
    }
        geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
            if (error) {
                return res.send({error})
            }
    
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({error})
                }
    
                res.send({
                    forcast: forecastData,
                    location,
                    address: req.query.address
                })
            })
        })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a serch term!'
        })
        
    }
    console.log(req.query)
    res.send({
        product:[]
    })
})
app.get('/help/*',(req, res) => {
    res.render('404', {
        title: '404',
        name:'Ruchika',
        errormessage:'Help article not found'
    })
})

app.get('*',(req, res) => {
    res.render('404', {
        title: '404',
        name:'Ruchika',
        errormessage:'Page not found'
    })
})
app.listen(3000, ()=> {
    console.log('Server is Up!')
})