# Open Classroom project n°7 - Groupomania
## Project description
Groupomania is an internal social network for Groupomania employees. The purpose of this tool is to facilitate interactions between colleagues.

For this project, the following technologies were used:

- Mysql/Sequelize
- React
- SCSS
- JS
 
## How to install and run the project
### Download
```terminal
git clone https://github.com/RayanBarbara/OC_P7_Groupomania.git
```
### Backend

1. Install dependencies (in folder `backend`).
```terminal
npm install
```

2. Configure environment variables by modifying the name of the file `example.env`
to `.env` and filling in all the information.

3. Create with MySQL a database named `groupomania`.

4. Create the database.
```terminal
npx sequelize-cli db:create
```
5. Migrate the data
```terminal
npx sequelize-cli db:migrate
```
6. Generate the administrator account and some test posts and comments.
```terminal
npx sequelize-cli db:seed:all
```
- Admin email: **admin@groupomania.com**
- Admin password: **@Admin01**

7. Start the server
```terminal
npm start
```
### Frontend
1. Install dependencies (in folder `frontend`).
```terminal
npm install
```
2. Start the server
```terminal
npm start
```

## License

MIT License

Copyright (c) [2023] [Rayan BARBARA]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
