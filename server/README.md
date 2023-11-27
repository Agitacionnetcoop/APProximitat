#APPROXIMITAT README

### BACKEND INSTALLATION

1. First of all, you need to clone the repository to your local machine. Open a terminal and type the following command:

```bash
git clone https://github.com/Agitacionnetcoop/APProximitat.git
```

2. Once you have the repository in your local machine, you need to install the dependencies. To do so, in the terminal, go to the root folder of the project and type the following command:

```bash
npm install
```

3. Now you can run the project. In the same terminal, go to the root folder of the project and type the following command:

```bash
npm run start
```

4. The project will be running in the port 3000. You can access it by typing the following URL in your browser:

```bash
http://localhost:3000/
```

5. Make sure to make and .env file in the root folder of the project with the following variables:

```bash
#DATABASE
EXTERNAL_DATABASE_HOST=
EXTERNAL_DATABASE_USER=
EXTERNAL_DATABASE_NAME=
EXTERNAL_DATABASE_PWD=

#SERVER
ASSETS_URL=
API_URL=
PORT=

#SENDGRID
SENDGRID_API_KEY=
SENDGRID_TEMPLATE_ID=
SENDGRID_TEMPLATE_ID_LOGIN=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=
SENDGRID_SUPORT_EMAIL=

#ONE SIGNAL
ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=
ONESIGNAL_BASE_URL=
```

### SERVER CONFIGURATION

Once you deploy the base code on your server, you need to configure the server. To do so, you need to follow the next steps:

With the script `syncWebApi`, you can synchronize the project with the server. The script will pull the project from the repository to the server and install the dependencies. To run the script, you need to be in the root folder of the project (example: `https://api.approximitat.cat/api`) and type the following command:

```bash
npm run syncWebApi
```

The `syncWebApi` script starts a pm2 process with the project. To restart this service, enter the following command:

```bash
pm2 restart cooapp-api
```

If you don't have pm2 installed, you can install it with the following command:

```bash
npm install pm2 -g
```

##

### BACKEND DOCUMENTATION

### 1. Architecture and Design

**MVC** (Model-View-Controller) is a software design pattern that structures applications into three components. The Model manages data and business logic, the View handles the user interface, and the Controller orchestrates user interactions. This separation fosters code organization, scalability, and maintainability. Widely used in web development, MVC streamlines application development, allowing independent modifications to each component.

This pattern enhances modularity, making it easier to manage data, presentation, and user input concerns. Implementing MVC promotes a clean and efficient codebase.

### 2. Main Technologies

- **Node.js**
  Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser.
- **Express**
  Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MySQL**
  MySQL is an open-source relational database management system.

### 3. API Endpoints

You can test the API endpoints using the thunder test folder. All you need to have is the thunder test extension installed in your VSCode with an account. Otherwise, you can use Postman or Insomnia.

- **Shop endpoints**

  - Home page
    - The main page of the application. It shows the user's preferences shops. The endpoint (/home) is a post request that receives the following parameters:
      - sustainabilityNames: array of sustainability names
      - categoryNames: array of category names
    - Use the **getPreferencesShops** function in the shop controller.
    - The output will be an array of categories and their shops.
  - Filter

    - The filter endpoint represents when the user tap on a category, sustainability tag or a simple tag. It shows the shops that match the filter. The endpoint (/filter) is a post request that receives the following parameters:
      _note: will only filter by one of the three parameters_
      - sustainabilityNames: string of the sustainability tag
      - categoryNames: string of the category name
      - tagNames: string of the tag
      - page: number
      - pageSize: number
    - Use the **filterShops** function in the shop controller.
    - The output will be an array of shops.

  - Shop detail

    - The shop detail endpoint represents the detail of a shop. The endpoint (/shop) is a post request that receives the following parameters:
      - id: shop id
      - userId: user id (optional)
    - Use the **getShop** function in the shop controller. We use user id (if we have a user logged) to know if the user purchased in the shop in case the shop has a fidelity card.
    - The output will be a shop object.

  - Map
    - The map endpoint represents the shops in a map. The endpoint (/map) is a post request that receives the following parameters:
      - latitude: number
      - longitude: number
      - sustainabilityNames: array of sustainability names (optional)
      - categoryNames: array of category names (optional)
      - shopId: number (optional)
      - page: number
      - pageSize: number
    - Use the **getShopsByCoordinates** function in the shop controller. Latitude and longitude are the coordinates of the user's location.
    - If you send a shop id as a parameter, the output will be an array of shops and the shop object of the shop id. Otherwise, the output will be an array of shops.
    - If you send sustainability names or category names as parameters, the output will be an array of shops that match the filters.
    - The output will be an array of shops.
  - Search
    - The search endpoint represents the shops that match the search. The endpoint (/search) is a post request that receives the following parameters:
      - search: string
      - page: number
      - pageSize: number
    - Use the **searchShops** function in the shop controller. Search is the string that the user types in the search bar in catalan or spanish (our accepted languages for now), but the result will be in catalan.
    - The output will be an array of shops.

###

- **Activity endpoints**
  - All activities
    - The all activities endpoint represents all the activities of the application. The endpoint (/allActivities) is a post request that receives the following parameters:
      - (_optional_): activityCatId: number
      - page: number
      - pageSize: number
    - Use the **getAllActivities** function in the activity controller. By default, it will return all the activities, but if you want to filter by activity category, you can pass the activityCatId parameter.
    - The output will be an array of activities and array of activities categories.
  - Activity detail
    - The activity detail endpoint represents the detail of an activity. The endpoint (/activityDetail) is a post request that receives the following parameters:
      - id: activity id
    - Use the **getActivity** function in the activity controller.
    - The output will be an activity object.

###

- **User endpoints**
  - Register
    - Register is the first endpoint that user will use. The endpoint (/register) is a post request that receives the following parameters:
      - name: string
      - email: string
    - Use the **register** function in the user controller.
    - The output will be a user object. The user object will have a token that will be used in the other endpoints. By default, user active parameter will be false, so the user will need to verify the email.
  - Login
    - Login (/login) is the endpoint that user will use to login. The endpoint is a post request that receives the following parameters:
      - email: string
    - Use the **login** function in the user controller.
    - The output will be a user object. The user object will have a token that will be used in the other endpoints.
  - Profile
    - Profile is where the user can change his profile. The endpoint (/profile) is a put request that receives the following parameters:
      - name: string
      - email: string
      - We will also have the token in the header.
    - Use the **profile** function in the user controller.
    - The output will be the user object modified.
  - Purchases
    - Purchases is where the user can see his purchases. The endpoint (/purchases) is a post request where we will have the token in the header.
    - Use the **userPurchases** function in the user controller.
    - The output will be an array of purchases.
  - Favorites
    - Favorites is where the user can see his favorites. The endpoint (/favorites) is a post request where we will have the token in the header.
    - Use the **favorites** function in the user controller.
    - The output will be an array of results.
  - Toggle favorites
    - Toggle favorites is where the user can add or remove a shop from his favorites. The endpoint (/toggleFavorites) is a put request that receives the following parameters:
      - shopId: number
      - We will also have the token in the header.
    - Use the **toggleFavorites** function in the user controller.
    - The output will be a favorite boolean.
  - List Notifications
    - List notifications is where the user can see his notifications. The endpoint (/listNotifications) is a post request where we will have the token in the header.
    - Use the **listNotifications** function in the user controller.
    - The output will be an array of notifications.
  - Send Notification
    - Send notification is where the user receives a notification. The endpoint (/sendNotification) is a post request that receives the offer id, the public_id (public user id for the user) and the shop id. Once we have those values, we get all the important information (for example, we check if the offer is completed or not). After that, we call to the onsSignal API to send the notification.
    - You can customize your notification in the onesignal dashboard.
    - Once the notification is sent, we store that information in the database so we can retrieve it later in the notifications list.
  - Delete account
    - Delete account is where the user can delete his account. The endpoint (/deleteAccount) is a delete request where we will have the token in the header and pass it to the query as user id.
    - Use the **deleteAccount** function in the user controller.
    - The output will be a boolean message.

###

- **Other endpoints**
  - Literals
    - The literals endpoint represents the literals of the application. The endpoint (/literals) is a get request. Also gets the sustainability tags, icons and categories.
    - Use the **getLiterals** function in the user controller.
    - The output will be an object with the literals, icons, an array of sustainability tags and categories.

### 4. Third-party libraries

- **sendgrid/mail**
  SendGrid is a cloud-based SMTP provider that allows you to send email without having to maintain email servers. We use it to send emails to the users.
- **jsonwebtoken**
  JSON Web Token (JWT) is a compact URL-safe means of representing claims to be transferred between two parties. We use it to generate a token for the user.
- **onesignal-node**
  A Node.js wrapper for OneSignal API. We use it to send push notifications to the users.
- **nanoid**
  A tiny, secure, URL-friendly, unique string ID generator. We use it to generate a unique id for the user.
- **jade**
  Jade is a high performance template engine heavily influenced by Haml and implemented with JavaScript for node. We use it to send redirection emails to the users.
