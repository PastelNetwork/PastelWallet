Running Pastel wallet on Mac OS:
--------------------------------

 - Download and install the [wallet app](https://dobrushskiy.name/static/pastel_build/Pastel-1.0.1.dmg)
 - Install Docker for Mac [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
 - After installation is complete - open Terminal and run `docker run -d -p 19932:19932 -p 19933:19933 alexdobrushskiy/pasteld:1.3`. This will download and run `pasteld` image. It's about 2GB in size - so please be patient. 
 - Then, run installed Pastel wallet. 
 - If everything is good - you should see `cNode status: connected` in the top right corner. At the bottom you'll see your wallet address. To register pastelID first you should get some coins on your wallet.
 
Dockerized pasteld for Mac OS:
------------------------------
Mac OS dockerized `pasteld` - run and verify that it runs well:
 - check containers run `docker container ls`. If something that you don't expect is running - stop it with `docker container stop <container id, like 71e79486d7f9>` 
 - run lastest pasteld image : `docker run -d -p 19932:19932 -p 19933:19933 alexdobrushskiy/pasteld:1.3` 
 - make sure it runs (not exited right after start): `docker container ls` - there should be container in output
 - double check that it runs well: first get container ID from `docker container ls` output. Then run `docker exec <container Id, ex 71e79486d7f9> pastel-cli getinfo` - it will display basic blockchain information. Please pay atteention to the `blocks` field value. Run same comand a few seconds later - if `blocks` has changed significantly (more then 1) - it means blockchain is not synced yet. 
