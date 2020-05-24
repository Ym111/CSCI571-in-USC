const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors())
app.get('/', (req, res) => res.json({ msg: '!!' })
);

const PORT = process.env.PORT || 5000;

//
app.use('/GD/getNews', require('./routes/GD/getNews'))
app.use('/GD/searchNews', require('./routes/GD/getNewsDetails'))
app.use('/GD/searchByQuery', require('./routes/GD/seachNews.js'))
app.use('/GD/searchTrend', require('./routes/GD/getTrend.js'))

app.use('/NY/getNews', require('./routes/NY/getNews'))
app.use('/NY/searchNews', require('./routes/NY/getNewsDetails'))
app.use('/NY/searchByQuery', require('./routes/NY/seachNews.js'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));