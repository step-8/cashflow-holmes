echo 'PORT="8000"' > .env
echo "Installing dependencies..."
npm install

echo "Setting Commit Template..."
git config --local commit.template .github/git_commit_template