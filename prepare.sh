NAME=__temp_key
INIT=./server/.data/init.toml

rm -f ./$NAME*

mkdir -p ./server/.data
echo "" > $INIT

ssh-keygen -t ed25519 -f __temp_key -N "" -q
cat ./$NAME.pub >> ~/.ssh/authorized_keys

echo "remote = \"host.docker.internal\"\n" >> $INIT
echo "hostname = \"$(hostname)\"\n" >> $INIT
echo "user=\"$(whoami)\"\n" >> $INIT
echo "key = \"\"\"$(cat ./$NAME)\"\"\"\n" >> $INIT

rm -f ./$NAME*

echo "Setup complete. Run 'docker-compose up' to start the dev server."
