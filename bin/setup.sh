echo "PORT='8000'
PUBLIC='./public'
REGISTER_PAGE='./views/register.html'
CRED_PATH='./private/credentials.json'
SECRET='CASH-FLOW'
ENV='dev'
" > .env

mkdir "private";
echo '{}' > private/credentials.json 

echo "Installing dependencies..."
npm install

echo "Setting Commit Template..."
git config --local commit.template .github/git_commit_template