# HDataMyAdmin
A web interface for HData servers

## Note
This is not to be used in production environments

## Prerequisites
1. NodeJS, etc.
2. An accessible HData server

## Install
1. Clone repo
2. Run `npm install`
3. Create `config.json` in the same folder as `app.js` with the following syntax

```json
{ 
    "hdataServer": {
        "host": "localhost", "port": 8888
    },
    "app": {
        "port": 3000
    }
}
```

4. Run `node app.js`
5. Log into the app with HData server credentials

## Screenshots

![Screenshot of the home tab](/src/static/assets/images/screenshot1.png)

![Screenshot of a table](/src/static/assets/images/screenshot2.png)
