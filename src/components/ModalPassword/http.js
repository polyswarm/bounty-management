class HttpAccount {
  constructor(url) {
    this.url = url;
  }

  unlockAccount(address, password) {
    const url = this.url;
    return new Promise((resolve, reject) => {
      if (!url) {
        reject('Invalid URI.');
      }
      resolve(address, password);
    })
      .then((address, password) => {
        fetch(url+'/unlock/'+address, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: {
            password: password
          }
        });
      })
      .then(response => response.ok)
      .catch(false);
  }
}
export default HttpAccount;
