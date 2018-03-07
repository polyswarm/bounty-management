import fetch from 'react';

class Http {
  constructor(url) {
    this.url = url;
  }

  uploadFiles(files) {
    return new Promise((resolve, reject) => {
      const url = this.url+'/artifacts';
      if(this.url && files && files.length > 0) {
        // Add files
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(file.name, file, file.name);
        });

        // open connection
        const xhr = XMLHttpRequest();

        // attach listeners
        xhr.onerror = () => reject(xhr.statusText);
        xhr.onload = () => resolve(xhr.response);

        // send to server
        xhr.open('post', url);
        xhr.send(formData);
      } else {
        reject('No URL set');
      }
    })
      .then(body => body.json)
      .then(json => json.artifacts)
      .catch(error =>  console.error(error));
  }

  uploadBounty(amount, artifacts, duration) {
    const url = this.url + '/bounties';
    return new Promise((resolve, reject) => {
      if(this.url && amount && duration && artifacts && artifacts.length > 0) {
        const bounty = {
          amount: amount,
          duration: duration,
          artifacts: artifacts
        };
        resolve(bounty);
      } else {
        reject('Invalid bounty.');
      }
    })
      .then(bounty => fetch(url, {
        method: 'post',
        body: bounty,
      }))
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error('Error response was not ok');
      })
      .then(response => response.json())
      .then(body => body.guid)
      .catch((error) => console.error(error));
  }
}
export default Http;