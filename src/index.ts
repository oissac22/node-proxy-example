import express, { application, request } from 'express'
import proxy from 'express-http-proxy';

const PORT = 5552;
const GOOGLE_DOMAIN = 'https://www.google.com.br/'
const MERCADO_LIVRE_DOMAIN = 'https://www.mercadolivre.com.br/'

const app = express()



app.get('/test', (req, res) => res.json({ ok: true, date: new Date() }))

app.use('/google', proxy(GOOGLE_DOMAIN, {
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        return proxyResData
            .toString()
            .replace(/(href=[\"\'])\//g, '$1/google/')
            .replace(/(src=[\"\'])\//g, '$1/google/')
            .replace(/(srcset=[\"\'])\//g, '$1/google/')
            .replace(/(url\()\//g, '$1/google/')
            .replace(/"gen_204/g, '"google/gen_204')
            .replace(/"\/gen_204/g, '"/google/gen_204')
            .replace(/"\/search/g, '"/google/search')
    }
}))

app.use('/mercado', proxy(MERCADO_LIVRE_DOMAIN))



app.use((req, res) => {
    res.status(404).send(`<h1>404 - Página não encontrada</h1>`)
})



app.listen(PORT, () => console.log(`RUN IN ${PORT}`))