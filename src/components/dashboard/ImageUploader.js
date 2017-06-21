import React, {Component} from 'react';
import {bindAll} from 'lodash';
import $ from 'jquery';
import axios from 'axios'

class ImageUploader extends Component {

  constructor() {
    super()
    this.state = {
      data_uri: null,
      processing: false
    }

    bindAll(this, 'handleFile', 'handleSubmit');
  }

  handleSubmit(e) {
    e.preventDefault();
    const _this = this;
    // const data = _this.state.data
    _this.setState({
        processing: true,
      });
   const options = {
      headers: {
        'Content-Type': this.state.file.type
      }
    };
    axios.get(`http://localhost:1337/api/users/sign-s3?&file-name=${this.state.filename}&file-type=${this.state.filetype}`)
    .then((res) => {
      debugger;
      axios.put(res.data.signedRequest, this.state.file, options).then((response) => {
        _this.setState({
          processing: false,
          uploaded_uri:this.state.data_uri
        });
      })
    })
    // const promise = $.ajax({
    //   url: '/api/v1/image',
    //   type: "POST",
    //   data: {
    //     data_uri: this.state.data_uri,
    //     filename: this.state.filename,
    //     filetype: this.state.filetype
    //   },
    //   dataType: 'json'
  // });


  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        file:file,
        data_uri: upload.target.result,
        filename: file.name,
        filetype: file.type
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    let processing;
    let uploaded;

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
          <img className='image-preview' src={this.state.uploaded_uri} />
          <pre className='image-link-box'>{this.state.uploaded_uri}</pre>
        </div>
      );
    }

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    return (
      <div className='row'>
        <div className='col-sm-12'>
          <label>Upload an image</label>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" onChange={this.handleFile} />
            <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
            {processing}
          </form>
          {uploaded}
        </div>
      </div>
    );
  }
}

export default ImageUploader;
