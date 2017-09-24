import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import moment from 'moment';

export default class LinksListItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      copied: false
    }
  }
  componentDidMount(){
    this.cb = new Clipboard(this.refs.copy);

    this.cb.on('success', () => {
      this.setState({copied:true});
      setTimeout(() => {
        this.setState({copied:false});
      }, 2000);
    }).on('error', () => {
      alert('bad try');
    })
  }
  componentWillUnmount(){
    this.cb.destroy();
  }
  renderStats(){
    const visitmsg = this.props.visitedCount <= 1 ? 'visit' : 'visits';
    let visitedMsg = null;

    if(typeof this.props.lastVisitedAt === 'number'){
      visitedMsg = `(visited ${moment(this.props.lastVisitedAt).fromNow()})`;
    }
    return <p className="item__message">{this.props.visitedCount} {visitmsg} {visitedMsg}</p>;
  }
  render() {
    return (
      <div className="item">
        <h2>{this.props.url}</h2>
        <p className="item__message">{this.props.shortUrl}</p>
        {this.renderStats()}
        <a className="button button--pill button--link" href={this.props.shortUrl}>
          Visit
        </a>
        <button className="button button--pill" ref="copy" data-clipboard-text={this.props.shortUrl}>
          {this.state.copied ? "Copied" : "Copy"}
        </button>
        <button className="button button--pill" onClick={() => {
          Meteor.call('links.setVisibility', this.props._id, !this.props.visible);
        }}>
          {this.props.visible ? "Hide" : "Unhide"}
        </button>
      </div>
    );
  }
}

LinksListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  shortUrl: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  visitedCount: PropTypes.number.isRequired,
  lastVisitedAt: PropTypes.number
}
