# Bounty Management Application

This Bounty Management Application is used to post Bounties to the PolySwarm marketplace running on Ethereum.

It lets the user select one or many suspicious files for analysis in the marketplace. 

## Managing Bounties

On first login users will be greeted with a welcome screen. Click the 'Get Started' button to find the main screen. The Welcome screen is only displayed once.

### Creating Bounties

The create bounties screen is the first screen after welcome on the first visit, or subsequent visits without creating any bounties. Users can get to this screen again by clicking the '+ Bounty' button.

This screen has a large drop target and list of files, and a button to create the bounty. The create button will remain disabled until the user adds some files to be uploaded.

A user adds files by either dragging and dropping the files into the light-purple drop target, or selecting files with the button inside. When ready to create, click the create button. This will open a modal window for unlocking your account. Select your desired account from the drop down, enter your password and click unlock. If you do not have any accounts in geth, you will have the opportunity to create an account. Enter your desired password, and the account will be created for you. However, this account will not be able to post any bounties until it has been funded with ETH for gas, and NCT for the bounty. 

With a funded account, after it is unlocked it will upload the files and post the bounty. Due to the nature of blockchain, this will take a fair bit of time. During the wait you are free to look at any existing bounties you have created. When the bounty finishes posting, the sidebar will show the new bounty GUID. 

In the event of an error, a modal window will popup letting you know about the failure.

### Viewing Bounties

To view a bounty, click the GUID in the sidebar on the left. This opens a screen that displays the files in the bounty and the assertions on them. The file list shows the names of uploaded files, and a ratio of safe verdicts over total verdicts. This ratio will be green if over 70% of verdicts deem it safe, yellow if between 50% and 69% , and red if under 50%. 

When a user clicks a file, the scrolling table on the right populates with assertions for that file. It gives the author, verdict, bid, and metadata. The metadata and bid are bounty specific, and may not pertain directly to the file displayed. For instance the author of the assertion may use metadata state the malware family of the file they judged malicious of a dozen.

## Running the Management Application

This application uses Electron to operate as a desktop application, no browser required. We provide .deb, .rpm and soon .exe versions of the application. Install the appropriate package for your platform. (Sorry, no macOS, yet). Before you run the application, make sure you have both geth and IPFS running.

Start geth with `geth --rpc --rpcapi "eth,web3,personal,net,debug" --ws --wsaddr "0.0.0.0" --wsport 8546 --wsapi "eth,web3,personal,net,debug" --wsorigins "*"`

You don't need to configure anything when using our package releases, but if you decide to customize the build, edit `.env` accordingly.

* REACT_APP_HOST the domain and port for the polyswarm daemon. 
* REACT_APP_WS_HOST the domain, port and route for polyswarm domain websockets. (Updated with bounties and assertions posted to the market)
* ETH_URI the domain and port where geth is running.
* IPFS_URI the domain and port where IPFS is running.
* BACKEND_DIR the version name of the polyswarm daemon release.

```
    REACT_APP_HOST=http://example.com:8080
    REACT_APP_WS_HOST=ws://example.com:8080/events
    ETH_URI=http://localhost:8545
    IPFS_URI=http://localhost:5001
    BACKEND_DIR=polyswarmd-v0.1

```

You shouldn't 
Once everything is running & configured, run `bounty-management` to launch the application.

When running from source, you need node, and electron-forge installed. Run `electron-forge start`.

## Running on Rinkeby

If you want to deploy to Rinkeby for some tests, you need to edit a couple things. 

1. Add the `--rinkeby` option to geth. 
2. Edit the polyswarmd.cfg file (example below) with Rinkeby contract addresses (We don't provide any, but you can deploy with truffle).

```polyswarm.cfg
NECTAR_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
BOUNTY_REGISTRY_ADDRESS = '0x0000000000000000000000000000000000000000'

```

## Cost

Currently, the application uses 1/16 NCT as a bid, and the contract adds an additional 1/16 NCT as a fee paid to the Arbiters. This means each bounty costs 2/16 NCT and gas, to post a set of files for analysis. 