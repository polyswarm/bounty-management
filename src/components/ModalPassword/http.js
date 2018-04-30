class HttpAccount {
  constructor(url) {
    this.url = url;
  }

  unlockWallet(address, password) {
    const url = this.url;
    return fetch(url+'/accounts/'+address+'/unlock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'password': password})
    })
      .then(response => response.ok)
      .catch(() => false);
  }

  createWallet(password) {
    const url = this.url;
    return fetch(url + '/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'password': password})
    })
      .then(response => response.ok)
      .catch(() => false);
  }

  getEth(address) {
    const url = this.url;
    return fetch(url+'/accounts/'+address+'/balance/eth')
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error('Failed to get balance');
      })
      .then(response => response.json())
      .then(json => json.result+'')
      .catch(() => 0);
  }

  getNct(address) {
    const url = this.url;
    return fetch(url+'/accounts/'+address+'/balance/nct')
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error('Failed to get balance');
      })
      .then(response => response.json())
      .then(json => json.result+'')
      .catch(() => 0);
  }
}
export default HttpAccount;
