# Set up the project

to setup the database for the backend development, firstly, you need to install docker and launch the command 
```
docker compose up -d
pnpm i
pnpx prisma migrate reset
pnpx prisma init --db
pnpx prisma migrate dev
```
at the root of this folder
