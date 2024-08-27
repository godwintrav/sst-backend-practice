# Shuffle Backend Exercise

Welcome to the Shuffle Backend exercise, in this exercise you are asked to complete a series of user stories using the SST Serverless stack in either _TypeScript, Python, Java or Go_.

The environment has already been configured to work with TypeScript out of the box and provided that we're currently using TypeScript onsite at Shuffle for developing the backend we advise that you stick to it as well.

## Using your own language

Should you insist on using another language other then TypeScript, you are expected to configure this on your own, make sure that its still one of the listed languages above together with an ORM, you are also required to setup Integration and Unit tests.

More instructions on how you could configure this is available here: https://docs.sst.dev/constructs/Function#configuring-nodejs-runtime

You are not expected to spend the hour onsite configuring the environment with your own language, unless you think you could do this in just a few minutes. Instead you should focus on completing the tasks that you will be given on the day.

Please note that you are not expected to use TypeScript on the job, TypeScript is only used for the sake of the exercise.

## Getting started with the TypeScript environment

1. Install Node.js, you can download it from here: https://nodejs.org/en/

2. Install Docker, you can download it from here: https://docs.docker.com/get-docker/

3. Install yarn, you can do this with the npm command:

   - `npm install -g yarn`

4. Setup AWS CLI, more instructions on how you can do this available here: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new-command

   - Use `eu-west-1` as the region.

5. Spin up the postgres database, you can do this with the docker command:

   - `docker-compose up -d`

6. Install node dependencies, you can do this with the yarn command:

   - `yarn install`

7. Run the database migrations, you can do this with the prisma command:

   - `yarn prisma migrate dev`


8. Finally, deploy the SST development environment, you can do this with the yarn command:

   - `yarn run dev`

   You're good to go now, please note that you do not have to run `yarn run dev` every time you make changes to the code. SST automatically watches your code for changes and utilises Hot and Live reloading to automatically deploy changes to AWS Serverless, and Lambda functions.
