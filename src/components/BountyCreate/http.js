class Http {
  constructor(url) {
    this.url = url;
    this.xhr = null;
  }

  cancel() {
    const { xhr } = this;
    if (xhr) {
      xhr.abort();
    }
  }

  uploadFiles(files) {
    return new Promise(resolve => {
      const url = this.url + '/artifacts';
      if (files && files.length > 0) {
        // Add files
        const formData = new FormData();
        files.forEach(file => {
          formData.append('file', file, file.name);
        });

        // open connection
        const xhr = new XMLHttpRequest();

        // attach listeners
        xhr.onerror = () => {
          throw Error(
            'Check that IPFS is running and you have an active internet connection.'
          );
        };
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.open('post', url);

        // send to server
        xhr.send(formData);
        this.xhr = xhr;
      } else {
        throw Error('No files passed.');
      }
    })
      .then(response => JSON.parse(response))
      .then(json => {
        if (json.result) {
          return json.result;
        } else {
          throw Error(
            'Check that IPFS is running and you have an active internet connection.'
          );
        }
      });
  }

  uploadBounty(amount, artifact, duration) {
    const url = this.url + '/bounties';
    return new Promise((resolve, reject) => {
      if (amount && duration && artifact && artifact.length > 0) {
        const bounty = JSON.stringify({
          amount: amount,
          duration: duration,
          uri: artifact
        });
        resolve(bounty);
      } else {
        reject('Invalid bounty.');
      }
    })
      .then(bounty =>
        fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          body: bounty
        })
      )
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error(response);
      })
      .then(response => response.json())
      .then(body => body.result);
  }
}
export default Http;
