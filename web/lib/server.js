/* eslint-env node */
const express = require('express');
const next = require('next');
require('dotenv').config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/locale/:locale', (req, res) => {
        console.log('locale')
        const { locale } = req.params;
        app.render(req, res, '/locale', { id: locale, ...req.query })
    });

    server.get('/om', (req, res) => {
      app.render(req, res, '/about', req.query)
    });

    server.get('/karta', (req, res) => {
      app.render(req, res, '/', req.query)
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
