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
          throw Error('Cannot get bounties.');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(bounty => this.getAssertionsForBounty(bounty))
      .then(bountyAssertions => this.getArtifactsForBounty(bountyAssertions))
      .then(bounty => {
        const assertions = bounty.assertions;
        let files = bounty.artifacts;
        assertions.forEach((assertion) => {
          assertion.verdicts.forEach((verdict, index) => {
            const file = files[index];
            if (!verdict) {
              file.good++;
            }
            file.total++;
            file.assertions.push({
              author: assertion.author,
              bid: assertion.bid,
              verdict: verdict,
              metadata: assertion.metadata
            });
            files[index] = file;
          });
        });
        bounty.artifacts = files;
        return bounty;
      })
      .catch(() => null);
  }

  getArtifactsForBounty(bounty) {
    return fetch(this.url+'/artifacts/'+bounty.uri)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(links => {
        return Promise.all(links.map((link, index) => {
          return fetch(this.url+'/artifacts/'+bounty.uri+'/'+index)
            .then(response => response.text());
        }));
      })
      .then(filesnames => {
        filesnames.sort();
        return filesnames.map((name) => {
          const trimmed = name.trim();
          return {name: trimmed, good: 0, total: 0, assertions: []};
        });
      })
      .then(files => {
        bounty.artifacts = files;
        return bounty;
      });
  }

  getAssertionsForBounty(bounty) {
    return fetch(this.url+'/bounties/'+bounty.guid+'/assertions')
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Unable to access accounts');
        }
      })
      .then(response => response.json())
      .then(json => json.result)
      .then(assertions => {
        return assertions.map((assertion) => {
          return {
            author: assertion.author,
            bid: assertion.bid,
            verdicts: assertion.verdicts,
            metadata: assertion.metadata,
          };
        });
      })
      .then(filtered => {
        bounty.assertions = filtered;
        return bounty;
      });
  }

  listenForAssertions(assertionAddedCallback) {
    // attach to websocket
    // anytime we get an assertion, check if it matchs a guid
    // if it does, add it to the assertions for that object
    const ws = this.ws;
    const websocket = new WebSocket(ws);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'assertion') {
        const body = message.data;
        const assertion = {
          guid: body.bounty_guid,
          bid: body.bid,
          verdicts: body.verdicts,
          metadata: body.metadata,
          author: body.author,
        };
        assertionAddedCallback(assertion);
      }
    };
  }
}
export default HttpApp;
