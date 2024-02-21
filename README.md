# README #

Playwright ReloQuest Automation, steps necessary to setup the project 

### What you need to know about the project organization

* The project is maintained in 2 main branches 'master' and 'develop'.
* master branch contains the code and tests for 'stage' env.
* develop branch contains the code and tests for 'rc' and 'autorc' env, and is constantly maintained due to the new changes.
* * to execute the test for stage env you need to be in the master branch.
* * to execute the test for rc and autorc env you need to be in the develop branch. 
* The 'utils' folder contains all the test data for each environment. ex:(uat, stage, rc, autorc)
* The 'page_factory' folder contains the objects selectors and the pages methods for each application. ex:(b2e, enterprise, api)
* The 'tests' folder contains all tests organized by application and features.

### How do I get set up? ###

* Download or clone the repository to a local workspace.
* Open the project with Visual studio Code or any other Code editor.
* On the VS code terminal execute 'npm install'.
* Use 'git fetch develop' to get the other branch that we are maintaining.   


### How execute the test ###

* Inside package.json you will find the scripts that can be executed. ex:("env:rc": "cross-env test_env=rc npx playwright test")
* In the VS Code terminal execute the command npm run <script>  ex:(npm run env:stage or npm run env:stage:e2e)
* For debug purpose execute 'npm run <script> -- --debug'

### Who do I talk to? ###

* Repo owner or admin (Jose Melendez or Ernesto Quinta)
