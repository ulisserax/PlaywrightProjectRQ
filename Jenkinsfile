pipeline {
    agent {
        node { 
            label 'playwright'  
        }
    }
    tools { 
        nodejs "default" 
    }
    parameters {
        string(defaultValue: 'stage', name: 'env', trim: true)
    }
    environment {
        SLACK_CHANNEL = "#automation-status"
    }
    stages {
        stage( 'install project'){
            steps {
                sh "npm install"
            }
        }
        stage('help') {
                        
            steps {
                // Depends on your language / test framework
                sh "npx playwright test --help" 
            }
        }
        stage('runing test') {
                        
            steps {
                // Depends on your language / test framework
                sh "npx playwright test --list"
                sh "npm run env:${params.env}"
            }
        }
    }

    post{
        success{
            slackSend( channel: SLACK_CHANNEL, token: "slack-token", color: "#00ff00", message: "${custom_msg()}")
        }
        failure{
            slackSend( channel: SLACK_CHANNEL, token: "slack-token", color: "#ff0000", message: "${custom_msg()}")
        }
        unstable{
            slackSend( channel: SLACK_CHANNEL, token: "slack-token", color: "#0000fe", message: "${custom_msg()}")
        }
        always{
            // Publish JUnit test results from 'test-results' directory
            junit '**/test-results/*.xml'
            
            // Archive 'playwright-report' and 'test-results' directories as artifacts
            archiveArtifacts artifacts: '**/playwright-report/**,**/test-results/**', fingerprint: true

            sh "aws s3 cp --region us-east-1 --recursive playwright-report s3://rq-playwright-test-report" // Upload to the static S3 site
            sh 'zip -r playwright-report-$(date +"%Y%m%d%H%M").zip playwright-report'
            sh 'aws s3 cp --region us-east-1 playwright-report-$(date +"%Y%m%d%H%M").zip s3://rq-playwright-zip-files' // Archive these results for future reference
        }
    }
}

def custom_msg()
{

  def JENKINS_URL = env.JENKINS_URL
  def JOB_NAME = env.JOB_NAME
  def BUILD_ID = env.BUILD_ID
  def STATUS = currentBuild.currentResult
  
  // Test result analyzer URL
  def TEST_RESULTS_ANALYZER_URL = "${JENKINS_URL}job/${JOB_NAME}/test_results_analyzer/"

  // Send Test results analyzer link to Slack
  //def JENKINS_LOG= "Job: ${JOB_NAME} \n Test Suite: ${params.env} \n Status: ${STATUS} \n Test results analyzer: ${TEST_RESULTS_ANALYZER_URL} \n HTML-Report: https://playwright.reloquest.com/"
  //return JENKINS_LOG
}

