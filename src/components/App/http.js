class HttpApp {
  constructor(url, ws) {
    this.url = url;
    this.ws = ws;
  }

  getUnlockedWallet() {
    return fetch(this.url+'/accounts/active')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => !json.locked)
      .catch(() => false);
  }

  getWallets() {
    return fetch(this.url+'/accounts')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .catch(() => []);
  }

  getBounty(bounty) {
    return fetch(this.url+'/bounties/'+bounty.guid)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.bounty)
      .then(bounty => this.getAssertionsForBounty(bounty))
      .then(bountyAssertions => this.getArtifactsForBounty(bountyAssertions))
      .then(bounty => {
        const assertions = bounty.assertions;
        let files = bounty.artifacts;
        Object.keys(assertions).forEach((key) => {
          const assertion = assertions[key];
          assertion.verdicts.forEach((verdict, index) => {
            const file = files[index];
            if (!verdict) {
              file.good++;
            }
            file.total++;
            file.assertions.push({
              author: key,
              bid: assertion.bid,
              verdict: verdict,
              metadata: assertion.metadata
            });
            files[index] = file;
          });
        });
        bounty.artifacts = files;
      });
  }

  getArtifactsForBounty(bounty) {
    fetch(this.url+'/artifacts/'+bounty.uri)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.links)
      .then(links => {
        // I don't know how this works, tbh.
        return links.map((link) => {
          return {name: link};
        });
      })
      .then(filenames => {
        filenames.sort();
        bounty.artifacts = filenames;
        return bounty;
      });
  }

  getAssertionsForBounty(bounty) {
    fetch(this.url+'/bounties/'+bounty.guid+'/assertions')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(assertions => {
        return assertions.map((assertion) => {
          const a = {};
          a[assertion.Author] = {
            bid: assertion.Bid,
            verdicts: assertion.Verdicts,
            metadata: assertion.Metadata,
          };
          return a;
        });
      })
      .then(filtered => {
        bounty.assertions = filtered;
        return bounty;
      });
  }

  listenForAssertions(bountyListCallback, assertionAddedCallback) {
    // attach to websocket
    // anytime we get an assertion, check if it matchs a guid
    // if it does, add it to the assertions for that object
    const ws = this.ws;
    const websocket = new WebSocket(ws);

    websocket.onMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.Type === 'Assertion') {
        const body = message.Body;
        const assertion = {
          guid: body.BountyGuid,
          bid: body.Bid,
          verdicts: body.Verdicts,
          metadata: body.Metadata,
          author: body.Author,
        };
        const bounties = bountyListCallback();
        const isFollowed = bounties.first((bounty) => bounty.guid === assertion.guid);
        if (isFollowed) {
          assertionAddedCallback(assertion);
        }
      }
    };
  }
}
export default HttpApp;
