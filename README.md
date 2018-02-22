# Requirements

1.  Application requires the credentials for sending emails using a SMTP server.
  * `MAIL_HOST`
  * `MAIL_PORT`
  * `MAIL_AUTH_USER`
  * `MAIL_AUTH_PASS`
2.  MongoDB credentials in the form of a connection string
  * `MONGODB_URI`
3.  Run the setup script to create a default user (you may modify default credentials in `setup.js` file) 
```sh
  $> vim $APP_PATH/etl_activities/setup.js
  $> node $APP_PATH/etl_activities/setup.js
```
4.  Remove the setup script from the server and launch platform with credentials provided.
```sh
  $> rm $APP_PATH/etl_activities/setup.js
```

5. Environment Variables

Widestage Credentials
WIDESTAGE=<domain>::<username>::<password>

Upload Directory
UPLOAD_DIR=/path/to/upload/directory