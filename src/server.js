const express = require("express") // Requerindo um pacote
const server = express()


// Configurar pasta pública
server.use(express.static("public"))

// Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))


// Pegar o banco de dados
const db = require("./database/db.js")


// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})





// Configurar caminhos da minha aplicação
// Página inicial

server.get("/", (req, res) => {
    // req: Requisição
    // res: Resposta
    return res.render("index.html")
})



server.get("/create-point", (req, res) => {

    // req.query: Query Strings da nossa url
    // console.log(req.query)

    return res.render("create-point.html")


})

server.post("/savepoint", (req, res) => {

    // req.body: O corpo do nosso formulário
    // console.log(req.body)

    // Inserir dados no banco de dados

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log(this)

        return res.render("create-point.html", { saved: true})
    }
    
    db.run(query, values, afterInsertData)
})



server.get("/search", (req, res) => {
    
    const search = req.query.search

    if(search == "") {
        // Pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        // Mostrar a página HTML com os resultados do banco de dados
        return res.render("search-results.html", { places: rows, total: total })
    })

})


// Ligar o servidor
server.listen(3000)