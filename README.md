# README #

Playwright ReloQuest Automation, steps necessary to setup the project 


### How do I get set up? ###

* Download or clone the repository to a local workspace
* Open the project with Visual studio Code or any other Code editor
* On the VS code terminal execute 'npm install'
* The 'utils' folder contains all the test data for each environment 


### How execute the test ###

* Inside package.json you will find the scripts that can be execute
* Ex: "env:rc": "cross-env test_env=rc npx playwright test"
* In the VS Code terminal execute the command 'npm run <script>'
* Ex: npm run env:stage
* For debug purpose execute 'npm run <script> -- --debug'

### Who do I talk to? ###

* Repo owner or admin (Jose Melendez or Ernesto Quinta)
