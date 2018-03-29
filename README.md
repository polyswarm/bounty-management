# Bounty Management Application

This Bounty Management Application is used to post Bounties to the PolySwarm marketplace running on Ethereum.

It lets the user select one or many suspicious files for analysis in the marketplace. 



## Managing Bounties

On first login users will be greeted with a welcome screen. Click the 'Get Started' button to find the main screen. The Welcome screen is only displayed once.

*If your browser does not support localStorage, you will see that screen every time you start. Also, all stored bounties will be tracked in the application.*

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

If you used the packed application, run it and navigate to http://localhost:8080 in a browser that supports Javascript & localStorage.

If you are running separately, edit the `.env` file to point to where you are running the PolySwarm daemon with geth and IPFS. We provide an example below. Please enter your own domain and instead of example.com:80.

```
    REACT_APP_HOST=http://example.com:80
    REACT_APP_WS_HOST=ws://example.com:80/events
```

When running from source, you need node, and yarn installed. Run the following command

```
yarn install
yarn start
```

## Cost

Currently, the application uses 1/16 NCT as a bid, and the contract adds an additional 1/16 NCT as a fee paid to the Arbiters. This means each bounty costs 2/16 NCT and gas, to post a set of files for analysis. 