import React from 'react';
import Chef from '../Chef';
import './Main.css';
import { connect } from 'react-redux';

class Main extends React.Component {
  render() {
    return (
      <div className="main">
        {this.props.chefs.map((chef, index, arr) => (
          <Chef
            key={chef._id}
            left={index === 0}
            index={index}
            right={index === arr.length - 1}
            id={chef._id}
            name={chef.name}
            dishes={chef.dishes}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = ({ chefs }) => ({ chefs });

export default connect(mapStateToProps)(Main);
