## Learnings....

- ### Setting up env

  - ##### Step 1

    - Instatll dotenv

            npm i dotenv

  - ##### Step 2
    - Create a `.env` file and Set Up Private Variables inside root folder.
    - Declare private variables for this specific envirounment
    - Always hide from git using `.gitignore`
  - ##### Step 3

    - Import in your app.js or whatever main module you prefar using..

            require('dotenv').config()

  - ##### Step 4

    - Access those variables using `process` global module

            process.env.VARIABLE_NAME
