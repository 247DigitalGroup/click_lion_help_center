echo ">> Updating System"
sudo apt-get update
# handle current bug in grub menu
sudo rm /boot/grub/menu.lst
sudo update-grub-legacy-ec2 -y
sudo apt-get dist-upgrade -qq --force-yes
# end handling
sudo apt-get -y upgrade
echo "Installing packages"
sudo apt-get -y install build-essential tcl8.5 git-core nginx nodejs-legacy npm

echo ">> Installing bower"
sudo npm install -g bower
echo ">> Installing Gulp"
sudo npm install -g gulp

echo ">> DONE"

