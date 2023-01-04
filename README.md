# README #

Playwright ReloQuest Automation, steps necessary to setup the project 


### How do I get set up? ###

* Download or clone the repository to a local workspace
* Open the project with Visual studio Code
* On the VS code terminal execute 'npm install'
* Inside the 'utils' folder create a new folder with name 'env_files'
* Inside the 'env_files' you can create all the env file needed following the naming convection 'env.<environment_name>'. Ex: env.qa
* The env files should contain all the private test data, in the env.ts file you could identified some of the test data that will need 
* 

### How execute the test ###

* Inside package.json you will find the scripts that can be execute
* Ex: "env:rc": "cross-env test_env=rc npx playwright test"
* In the VS Code terminal execute the command 'npm run <script>'
* Ex: npm run env:stage
* For debug purpose execute 'npm run <script> -- --debug'

### Who do I talk to? ###

* Repo owner or admin (Ernesto Quinta or Jose Melendez)
