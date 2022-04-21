# Node-Queue
> ## Features
- [x] Send emails in queue
- [x] Add new processes to running queue
- [x] Add new processes in bulk to running queue
- [x] Set max parallel processes
- [x] Set max attempts
- [x] Dynamically import all jobs from jobs folder
- [ ] Integration with redis
> ## Tools and Libraries
- Typescript
- Eslint
- Express
- Nodemailer
- Nodemon
- Redis
- Docker
> ## How to run
```
  # Import repository:
  git clone https://github.com/Mist3rBru/node-queue.git;
  cd node-queue;

  # Import dependencies:
  npm install;

  # Run using local redis:
  nom run dev;

  # or using docker:
  npm run docker;

  # Send POST request to:
  # http://localhost:3030/users
  # http://localhost:3030/users/bulk/:count
```