import App from './components/App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import passport from 'passport';
import express from 'express';
import bodyParser from 'body-parser';
import { renderToString } from 'react-dom/server';
import { Provider } from 'mobx-react';
import AppStore from './stores/AppStore';
import authRoutes from './routes/auth';
import connectDb from './db/connect';
import passportInit from './db/passport';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const app = express();

app.disable('x-powered-by');
app.use(express.static(process.env.RAZZLE_PUBLIC_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectDb(app);
passportInit(app);
authRoutes(app);

app.get('/*', passport.authenticationMiddleware(), (req, res) => {
    const context = {};
    const app = new AppStore({
      user: req.user || {},
    });
    const markup = renderToString(
      <Provider app={app}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body data-user=${JSON.stringify(req.user || {})}>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

export default app;
