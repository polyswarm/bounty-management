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
    return new Promise((resolve, reject) => {
      const url = this.url+'/artifacts';
      if(files && files.length > 0) {
        // Add files
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('file', file, file.name);
        });

        // open connection
        const xhr = new XMLHttpRequest();

        // attach listeners
        xhr.onerror = () => reject(Error('Are you connected to the internet?'));
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.open('post', url);

        // send to server
        xhr.send(formData);
        this.xhr = xhr;
      } else {
        reject(Error('No files passed.'));
      }
    })
      .then(response => JSON.parse(response))
      .then(json => {
        if (json.status === 'FAIL') {
          throw Error('Unable to upload files.');
        }
        return json;
      })
      .then(json => json.result);
  }

  uploadBounty(amount, artifact, duration) {
    const url = this.url + '/bounties';
    return new Promise((resolve, reject) => {
      if(amount && duration && artifact && artifact.length > 0) {
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
      .then(bounty => fetch(url, {
        headers: {
          'Content-Type':'application/json'
        },
        method: 'post',
        body: bounty
      }))
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error('Error response was not ok');
      })
      .then(response => response.json())
      .then(body => body.result);
  }
}
export default Http;
