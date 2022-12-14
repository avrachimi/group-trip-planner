# Group Trip Planner

## Description

I've discussed multiple holiday trips with friends and most of them didn't happen. A friend gave me the idea to create a web app where groups of friends can sign up and post potential trips with more details like description, budget etc. So I created a Full Stack app that does just that.

You can sign up, create a group with friends, add destinations, vote on destinations and manage your account. I've built this with how I would like it to work and behave. There are some things that might not make sense for something that would be available at large scale. For example, there's no field for a date. I purposefully designed it this way to divert conversations about the date AFTER the destination location has been decided.

This was my first proper try at front-end. I didn't want to use libraries like Bootstrap or frameworks like React, to not overcomplicate things. I used HTML(EJS), CSS(Sass) and Javascript.

***
## How to Install and Run

1. Clone this repository and navigate into it.
2. Install the dependencies using `npm install`
3. Run a local SQL Server. I used MySQL. ([more info here](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing))  
4. Create a `.env` file at the root directory of the project containing environment variables for:
    - `PORT` - Port to run on
    - `SESSION_KEY` - Session Secret
    - `DB_NAME` - Your database name. I used `group_trip_planner_db`
    - `DB_USERNAME` - You database username
    - `DB_PASSWORD` - Your database password
    - `DB_HOST` - Your database server IP
    - `DB_PORT` - Your database server Port
    - `DB_DIALECT` - The dialect of your database. I used `mysql`
5. Run with `npm start`

***
### Tech Stack
- Node.js
- MySQL
- HTML, CSS (Sass), Javascript

### Dependencies
- [dotenv](https://www.npmjs.com/package/dotenv)  
- [express](https://www.npmjs.com/package/express)  
- [express-session](https://www.npmjs.com/package/express-session)  
- [express-session-sequelize](https://www.npmjs.com/package/express-session-sequelize)  
- [mysql2](https://www.npmjs.com/package/mysql2)
- [sequelize](https://www.npmjs.com/package/sequelize)
- [ejs](https://www.npmjs.com/package/ejs)  
- [bcrypt](https://www.npmjs.com/package/bcrypt)  
- [cors](https://www.npmjs.com/package/cors)  
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)  
- [method-override](https://www.npmjs.com/package/method-override)  