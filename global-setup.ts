import * as dotenv from 'dotenv';

module.exports = async config => {
    if (process.env.test_env){
        dotenv.config({
            path:`./utils/env_files/env.${process.env.test_env}`,
            override:true
        })
    }
};