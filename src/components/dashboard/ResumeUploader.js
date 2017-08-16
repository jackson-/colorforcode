import React, {Component} from 'react';
import {bindAll} from 'lodash';

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

    this.props.uploadResume(this.props.user, this.state.file)
    _this.setState({
        uploaded_uri:this.state.data_uri
      });


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
          <img className='image-preview' src={this.state.uploaded_uri} alt='resume preview' />
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
          <label>Upload your resume</label>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" onChange={this.handleFile} />
            {processing}
          </form>
          {uploaded}
        </div>
      </div>
    );
  }
}

export default ImageUploader;
