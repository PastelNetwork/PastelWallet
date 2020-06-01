Running Pastel wallet on Mac OS:
--------------------------------

 - Download and install the [wallet app](https://dobrushskiy.name/static/Pastel-1.0.0.dmg)
 - Install Docker for Mac [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
 - After installation is complete - open Terminal and run `docker run -d -p 19932:19932 -p 19933:19933 alexdobrushskiy/pasteld:0.9`. This will download and run `pasteld` image. It's about 2GB in size - so please be patient. 
 - Then, run installed Pastel wallet. 
 - If everything is good - you should see `cNode status: connected` in the top right corner. At the bottom you'll see your wallet address. To register pastelID first you should get some coins on your wallet.  