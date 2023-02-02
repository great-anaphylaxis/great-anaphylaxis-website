git add .
git commit -m %1
git remote add origin https://github.com/great-anaphylaxis/great-anaphylaxis-website.git
git remote -v
git pull
git push origin master

firebase deploy