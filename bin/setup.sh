echo "PORT='8000'
PUBLIC='./public'
REGISTER_PAGE='./views/register.html'
LOGIN_PAGE='./views/login.html'
CRED_PATH='./private/credentials.json'
SECRET='CASH-FLOW'
ENV='dev'
" > .env

echo '#! /bin/bash

npm run test

if [[ $? != 0 ]]; then
  echo "Some of the tests are failing."
  exit 1
fi' >.git/hooks/pre-commit

chmod +x .git/hooks/pre-commit

mkdir "private"
echo '{}' > private/credentials.json

echo "Installing dependencies..."
npm install

echo "Setting Commit Template..."
git config --local commit.template .github/git_commit_template

chmod u+x ./bin/new_test.sh