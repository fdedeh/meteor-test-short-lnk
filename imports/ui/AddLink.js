import React from 'react';
import Modal from 'react-modal';
import { Meteor } from 'meteor/meteor';

export default class AddLink extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      url: "",
      isOpen: false,
      error: ''
    }
  }
  onChange(e){
    this.setState({
      url: e.target.value.trim()
    })
  }
  onSubmit(e){
    e.preventDefault();
    const { url } = this.state;

    Meteor.call('links.insert', url, (err, res) => {
      if(!err){
        this.handleModalClose();
        Bert.alert({
          title: 'URL Added',
          message: `URL ${url} saved.`,
          type: 'info',
          style: 'growl-top-right',
          icon: 'fa-check'
        });
      } else if(err){
        this.setState({error: err.reason})
        Bert.alert({
          title: 'Check the URL inserted!',
          message: `${this.state.error}`,
          type: 'danger',
          style: 'growl-top-right',
          icon: 'fa-check'
        });
      }
    });
  }
  handleModalClose(){
    this.setState({
      isOpen:false,
      url:'',
      error:''
    });
  }
  render() {
    return (
      <div>
        <button onClick={() => this.setState({isOpen:true})} className="button">+ Add Link</button>
        <Modal
          isOpen={this.state.isOpen}
          contentLabel='Add link'
          onAfterOpen={() => this.refs.url.focus()}
          onRequestClose={this.handleModalClose.bind(this)}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
        >
          <p>Add Link</p>
          {this.state.error && <p>{this.state.error}</p>}
          <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
            <input
              type="text"
              placeholder="URL"
              ref="url"
              value={this.state.url}
              onChange={this.onChange.bind(this)}
            />
            <button className="button">Add Link</button>
            <button
              className="button button--secondary"
              type="button"
              onClick={this.handleModalClose.bind(this)}
            >
              Cancel
            </button>
          </form>
        </Modal>
      </div>
    )
  }
}
