# TypeScript Login & Register Boilerplate

A basic boilerplate to get started using a login/register script with alt:V.

## Installation

To begin with, you need to know which database you're using. Typeorm supports the following databases as of now:

- MySQL
- MariaDB
- Postgres
- CockroachDB
- SQLite
- Microsoft SQL Server
- Oracle
- SAP Hana
- sql.js

Pick your database and install it via npm/yarn. An example to install MariaDB would be:

```bash
npm i mariadb
```

To install all other missing dependencies just enter the following:

```bash
npm i
```

After you installed all dependencies, you need to configure your database connection. This file can be found inside `scr/server/database/index.ts`. Here you can change all database params to your needs.

**ATTENTION:** Don't use an account with root access to your database. Otherwise you can be sure, your data gets stolen or compromized.

## Building the resource

To build the project you basicly just need to run the build command:

```bash
npm run build
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
